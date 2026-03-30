from langchain_openai import ChatOpenAI
from app.core.config import settings

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL = "anthropic/claude-3.5-haiku"


def ask_about_metrics(question: str, recent_metrics: list[dict]) -> str:
    llm = ChatOpenAI(
        api_key=settings.OPEN_ROUTER_API_KEY,
        base_url=OPENROUTER_BASE_URL,
        model=MODEL,
    )
    metrics_summary = "\n".join(
        f"[{m['timestamp']}] CPU={m['cpu']}% MEM={m['memory']}% "
        f"Latency={m['api_latency_ms']}ms ErrorRate={m['error_rate']}%"
        for m in recent_metrics
    )
    prompt = f"""You are an observability assistant for a infrastructure monitoring tool called DevPulse.
Here are the most recent metric snapshots:

{metrics_summary}

Answer this question concisely: {question}"""
    return llm.invoke(prompt).content
