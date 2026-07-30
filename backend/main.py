"""
J-Mail Master — FastAPI Backend
日本語ビジネスメール自動生成API

エンドポイント:
  POST /generate  : 2案のメールを生成
  POST /refine    : 既存メールを微調整
"""

import os
import json
import pathlib
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# --- OpenAI はオプション ---
try:
    from openai import OpenAI as _OpenAI
    _openai_available = True
except ImportError:
    _openai_available = False

# ---------------------------------------------------------------------------
# アプリ初期化
# ---------------------------------------------------------------------------
app = FastAPI(title="J-Mail Master API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic モデル
# ---------------------------------------------------------------------------
class GenerateRequest(BaseModel):
    purpose: str
    relationship: Optional[str] = None
    tone: Optional[str] = "非常に丁寧"
    core_requirements: str
    sender_name: Optional[str] = None
    sender_company: Optional[str] = None
    sender_department: Optional[str] = None
    sender_title: Optional[str] = None
    sender_signature: Optional[str] = None


class EmailVariant(BaseModel):
    label: str
    subject: str
    body: str


class RefineRequest(BaseModel):
    subject: str
    body: str
    action: str  # more_polite | shorter | soften_urgency | add_seasonal
    sender_name: Optional[str] = None
    sender_company: Optional[str] = None


class RefineResponse(BaseModel):
    subject: str
    body: str


# ---------------------------------------------------------------------------
# ユーティリティ
# ---------------------------------------------------------------------------
def _seasonal_greeting() -> str:
    """現在の月に応じた季節の挨拶を返す"""
    month = datetime.now().month
    table = {
        1:  "謹んで新春のお慶びを申し上げます。",
        2:  "余寒の候、貴社におかれましては益々ご清栄のこととお慶び申し上げます。",
        3:  "春暖の候、貴社におかれましては益々ご清栄のこととお慶び申し上げます。",
        4:  "陽春の候、貴社におかれましては益々ご発展のこととお慶び申し上げます。",
        5:  "新緑の候、貴社におかれましては益々ご清栄のこととお慶び申し上げます。",
        6:  "初夏の候、貴社におかれましては益々ご繁栄のこととお慶び申し上げます。",
        7:  "盛夏の候、貴社におかれましては益々ご清祥のこととお慶び申し上げます。",
        8:  "晩夏の候、貴社におかれましては益々ご活躍のこととお慶び申し上げます。",
        9:  "初秋の候、貴社におかれましては益々ご清栄のこととお慶び申し上げます。",
        10: "秋冷の候、貴社におかれましては益々ご発展のこととお慶び申し上げます。",
        11: "晩秋の候、貴社におかれましては益々ご繁栄のこととお慶び申し上げます。",
        12: "師走の候、貴社におかれましては益々ご清栄のこととお慶び申し上げます。",
    }
    return table.get(month, "")


def _build_opening(req: GenerateRequest) -> str:
    base = "いつも大変お世話になっております。"
    if req.sender_company and req.sender_name:
        return f"{base}{req.sender_company}の{req.sender_name}でございます。"
    if req.sender_name:
        return f"{base}{req.sender_name}でございます。"
    return base


def _build_signature(req: GenerateRequest) -> str:
    if req.sender_signature:
        return req.sender_signature
    parts: List[str] = []
    if req.sender_company:
        parts.append(req.sender_company)
    if req.sender_department:
        parts.append(req.sender_department)
    if req.sender_title:
        parts.append(req.sender_title)
    if req.sender_name:
        parts.append(req.sender_name)
    return "\n".join(parts)


PURPOSE_LABEL = {
    "新規営業・提案": "ご提案",
    "日程調整": "日程のご確認",
    "謝罪・クレーム対応": "お詫び",
    "社内報告": "ご報告",
    "お礼": "お礼",
}

CUSHION_BY_PURPOSE = {
    "新規営業・提案": "突然のご連絡をお許しください。",
    "日程調整": "お手数をおかけいたしますが、",
    "謝罪・クレーム対応": "この度は多大なるご迷惑をおかけいたしまして、誠に申し訳ございません。",
    "社内報告": "お忙しいところ恐れ入りますが、",
    "お礼": "先日はお時間を頂戴いたしまして、誠にありがとうございました。",
}

# ---------------------------------------------------------------------------
# ルールベース生成
# ---------------------------------------------------------------------------
def _rule_based_generate(req: GenerateRequest) -> List[EmailVariant]:
    opening = _build_opening(req)
    signature = _build_signature(req)
    seasonal = _seasonal_greeting()
    core = req.core_requirements.strip()

    subject_label = PURPOSE_LABEL.get(req.purpose, req.purpose)
    head = core.replace("\n", " ").split("。")[0][:28]
    subject = f"【{subject_label}】{head}の件"

    cushion = CUSHION_BY_PURPOSE.get(req.purpose, "恐れ入りますが、")
    sig_block = ("\n" + "─" * 32 + "\n" + signature) if signature else ""

    # --- バリアント1: 非常に丁寧 ---
    include_seasonal = (
        "丁寧" in (req.tone or "")
        or "季節" in (req.tone or "")
        or req.tone == "可能な限り丁寧（季節の挨拶含む）"
    )
    b1 = opening + "\n\n"
    if include_seasonal and seasonal:
        b1 += seasonal + "\n\n"
    b1 += f"さて、{req.purpose}の件につきましてご連絡申し上げます。\n\n"
    b1 += cushion + "以下の内容をご確認いただけますでしょうか。\n\n"
    b1 += core + "\n\n"
    b1 += "ご多忙の折、誠に恐れ入りますが、何卒よろしくお願い申し上げます。"
    b1 += sig_block

    # --- バリアント2: 簡潔・明確 ---
    b2 = opening + "\n\n"
    b2 += f"{req.purpose}の件でご連絡いたします。\n\n"
    b2 += core + "\n\n"
    b2 += "ご確認のほど、よろしくお願いいたします。"
    b2 += sig_block

    return [
        EmailVariant(label="非常に丁寧", subject=subject, body=b1),
        EmailVariant(label="簡潔・明確", subject=subject, body=b2),
    ]


# ---------------------------------------------------------------------------
# OpenAI 生成
# ---------------------------------------------------------------------------
def _openai_generate(req: GenerateRequest) -> Optional[List[EmailVariant]]:
    if not _openai_available:
        return None
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None

    system_prompt = (
        "あなたは東京の企業で10年間勤務している、優秀なB2B営業パーソンです。\n"
        "以下のルールを必ず守ってください：\n"
        "1. 目的と関係性に合わせた正確な尊敬語・謙譲語・丁寧語を使い分けること\n"
        "2. 文脈に合ったクッション言葉（例：「恐れ入りますが」「お手数をおかけしますが」）を必ず使うこと\n"
        "3. 二重敬語（例：「おっしゃられた」）は絶対に使わないこと\n"
        "4. ユーザーが入力したコア要件に含まれる日時・金額・固有名詞などの事実情報を絶対に変更・省略・捏造しないこと\n"
        "5. 入力にない情報を勝手に追加しないこと\n"
        "6. 生成するメールは必ず日本語で書くこと"
    )

    signature = _build_signature(req)

    user_prompt = (
        f"以下の要件に基づき、日本語のビジネスメールを2案作成してください。\n\n"
        f"メールの目的: {req.purpose}\n"
        f"相手との関係性: {req.relationship or '未指定'}\n"
        f"トーン: {req.tone or '非常に丁寧'}\n"
        f"コア要件: {req.core_requirements}\n"
    )
    if req.sender_name:
        user_prompt += f"送信者名: {req.sender_name}\n"
    if req.sender_company:
        user_prompt += f"会社名: {req.sender_company}\n"
    if req.sender_department:
        user_prompt += f"部署: {req.sender_department}\n"
    if signature:
        user_prompt += f"署名: {signature}\n"

    user_prompt += (
        "\n以下のJSON配列のみを返してください（マークダウンや説明文は不要）:\n"
        '[{"label":"非常に丁寧","subject":"件名","body":"本文"},'
        '{"label":"簡潔・明確","subject":"件名","body":"本文"}]'
    )

    try:
        client = _OpenAI(api_key=key)
        model = os.environ.get("OPENAI_MODEL", "gpt-4o")
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=2000,
            temperature=0.7,
        )
        raw = resp.choices[0].message.content.strip()
        # コードブロックがあれば除去
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
        return [EmailVariant(**v) for v in data]
    except Exception:
        return None


# ---------------------------------------------------------------------------
# OpenAI による修正
# ---------------------------------------------------------------------------
def _openai_refine(req: RefineRequest) -> Optional[RefineResponse]:
    if not _openai_available:
        return None
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None

    action_prompts = {
        "more_polite": "このメールをより丁寧な敬語・クッション言葉を使って書き直してください。季節の挨拶も必要に応じて追加してください。",
        "shorter": "このメールの要点を保ちつつ、簡潔に短く書き直してください。冗長な表現は削除してください。",
        "soften_urgency": "このメールの催促・期限に関する表現を、相手の負担にならないよう柔らかく緩和してください。",
        "add_seasonal": f"このメールの冒頭に、現在の月（{datetime.now().month}月）に合った季節の挨拶を自然な形で追加してください。",
    }
    instruction = action_prompts.get(req.action, "このメールを改善してください。")

    system_prompt = (
        "あなたは東京の企業で10年間勤務している、優秀なB2B営業パーソンです。"
        "日本語ビジネスメールの専門家として、指示に従いメールを修正してください。"
        "事実情報（日時・金額・固有名詞）は変更しないこと。二重敬語は使わないこと。"
    )
    user_prompt = (
        f"{instruction}\n\n"
        f"【件名】\n{req.subject}\n\n"
        f"【本文】\n{req.body}\n\n"
        'JSON形式のみで返してください: {"subject":"修正後の件名","body":"修正後の本文"}'
    )

    try:
        client = _OpenAI(api_key=key)
        model = os.environ.get("OPENAI_MODEL", "gpt-4o")
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=1500,
            temperature=0.5,
        )
        raw = resp.choices[0].message.content.strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
        return RefineResponse(**data)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# ルールベース修正
# ---------------------------------------------------------------------------
def _rule_based_refine(req: RefineRequest) -> RefineResponse:
    body = req.body
    subject = req.subject

    if req.action == "more_polite":
        if "よろしくお願いいたします。" in body:
            body = body.replace(
                "よろしくお願いいたします。",
                "何卒よろしくお願い申し上げます。"
            )
        if "確認してください" in body:
            body = body.replace(
                "確認してください",
                "ご確認いただけますでしょうか"
            )

    elif req.action == "shorter":
        # 冗長な定型句を短縮
        replacements = [
            ("誠に恐れ入りますが、何卒よろしくお願い申し上げます。", "よろしくお願いいたします。"),
            ("ご多忙の折、誠に恐れ入りますが、", ""),
        ]
        for old, new in replacements:
            body = body.replace(old, new)

    elif req.action == "soften_urgency":
        replacements = [
            ("ご回答ください", "ご確認いただければ幸いです"),
            ("至急", "お手すきの際に"),
            ("急ぎ", "お時間のある際に"),
            ("必ず", "できましたら"),
            ("ご返答ください", "ご返答いただけますと幸いです"),
        ]
        for old, new in replacements:
            body = body.replace(old, new)

    elif req.action == "add_seasonal":
        greeting = _seasonal_greeting()
        if greeting and greeting not in body:
            # 冒頭の「いつも〜」の後に挿入
            if "いつも" in body:
                lines = body.split("\n")
                insert_idx = 0
                for i, line in enumerate(lines):
                    if "いつも" in line:
                        insert_idx = i + 1
                        break
                # 空行 + 季節の挨拶を挿入
                lines.insert(insert_idx, "")
                lines.insert(insert_idx + 1, greeting)
                body = "\n".join(lines)
            else:
                body = greeting + "\n\n" + body

    return RefineResponse(subject=subject, body=body)


# ---------------------------------------------------------------------------
# API エンドポイント
# ---------------------------------------------------------------------------
@app.post("/generate", response_model=List[EmailVariant])
def generate(req: GenerateRequest):
    """2案のビジネスメールを生成する（OpenAI優先、失敗時はルールベース）"""
    provider = os.environ.get("GENERATION_PROVIDER", "auto")
    if provider in ("openai", "auto"):
        result = _openai_generate(req)
        if result:
            return result
    return _rule_based_generate(req)


@app.post("/refine", response_model=RefineResponse)
def refine(req: RefineRequest):
    """既存メールを修正チップに従って微調整する"""
    provider = os.environ.get("GENERATION_PROVIDER", "auto")
    if provider in ("openai", "auto"):
        result = _openai_refine(req)
        if result:
            return result
    return _rule_based_refine(req)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "openai_available": _openai_available,
        "openai_configured": bool(os.environ.get("OPENAI_API_KEY")),
    }


# ---------------------------------------------------------------------------
# ビルド済みフロントエンドの配信（本番用）
# ---------------------------------------------------------------------------
_frontend_dist = pathlib.Path(__file__).parent.parent / "frontend" / "dist"
if _frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(_frontend_dist / "assets")), name="assets")

    @app.get("/", include_in_schema=False)
    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_spa(full_path: str = ""):
        index = _frontend_dist / "index.html"
        return FileResponse(str(index))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
