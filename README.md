<div align="center">

# STOCKLENS

### Explainable AI Market Intelligence

**Evidence → Multi-Agent Analysis → Explainable Research → Investor Intelligence**

<br/>

<img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
<img src="https://img.shields.io/badge/React_19-1E293B?style=for-the-badge&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/TypeScript-1E293B?style=for-the-badge&logo=typescript&logoColor=3178C6"/>
<img src="https://img.shields.io/badge/Django-0B3D0B?style=for-the-badge&logo=django&logoColor=44B78B"/>
<img src="https://img.shields.io/badge/PostgreSQL-1E2A47?style=for-the-badge&logo=postgresql&logoColor=4169E1"/>
<img src="https://img.shields.io/badge/Supabase-16302A?style=for-the-badge&logo=supabase&logoColor=3ECF8E"/>

<br/>

<img src="https://img.shields.io/badge/STATUS-ACTIVE_DEVELOPMENT-334155?style=flat-square"/>
<img src="https://img.shields.io/badge/ARCHITECTURE-MULTI--AGENT-334155?style=flat-square"/>
<img src="https://img.shields.io/badge/DESIGN-EVIDENCE--FIRST-334155?style=flat-square"/>
<img src="https://img.shields.io/badge/LICENSE-MIT-334155?style=flat-square"/>

</div>

<br/>

---

## 01 · The Idea

**StockLens** is an evidence-driven financial intelligence platform that converts fragmented market information into structured, explainable research.

Instead of sending a stock question directly to an LLM, StockLens routes it through a disciplined research pipeline:

**Collect → Normalize → Analyze → Validate → Reason → Explain**

> The model is a reasoning layer. It is never the source of market truth.

**What StockLens analyzes**

| Domain | Coverage |
|---|---|
| **Technical** | Trend, momentum, indicators, volatility |
| **Fundamental** | Earnings, valuation, growth, financial health |
| **News** | Events, catalysts, sentiment |
| **Risk** | Volatility, drawdown, leverage, liquidity, concentration |
| **Portfolio** | Holdings, exposure, research context |
| **Monitoring** | Watchlists, threshold-based alerts |

<br/>

---

## 02 · Why StockLens

**Traditional market platforms provide:**

```
Charts + Metrics + News
```

**Generic AI products provide:**

```
Prompt + Context → Generated Answer
```

**StockLens combines both into an evidence-driven intelligence pipeline:**

```mermaid
flowchart TB
    A[Real Market Data] --> B[Specialized Agents]
    B --> C[Evidence Validation]
    C --> D[Cross-Domain Reasoning]
    D --> E[Explainable Research]
    E --> F[Investor Intelligence]

    classDef step fill:#1E293B,stroke:#0F172A,color:#fff
    classDef final fill:#3B4B6B,stroke:#1E293B,color:#fff

    class A,B,C,D,E step
    class F final
```

> StockLens is not an AI chatbot that talks about stocks. It is a financial intelligence system that builds an evidence layer first, reasons across multiple research domains, and then explains every major conclusion.

<br/>

---

## 03 · Roadmap

```mermaid
flowchart TB
    A[StockLens MVP] --> B[Market Data]
    A --> C[Fundamentals]
    A --> D[News and Sentiment]
    B --> E[Technical and Risk]
    C --> E
    D --> E
    E --> F[Evidence-Grounded AI]
    F --> G[Real-Time Events]
    G --> H[Smart Alerts]
    G --> I[Portfolio Risk]
    H --> J[Research Memory]
    I --> J
    J --> K[Personalization]
    K --> L[Backtesting and Intelligence]

    classDef base fill:#1E293B,stroke:#0F172A,color:#fff
    classDef mid fill:#334155,stroke:#0F172A,color:#fff
    classDef final fill:#0F4C4C,stroke:#0B3A3A,color:#fff

    class A,B,C,D base
    class E,F,G,H,I,J,K mid
    class L final
```

<br/>

---

## 04 · System Architecture

```mermaid
flowchart TB
    U[Investor] --> FE[Next.js Web App]
    FE --> API[Django REST API]

    API --> AUTH[Supabase Auth]
    API --> ACL[Authorization and Ownership]

    ACL --> ORCH[Analysis Orchestrator]

    ORCH --> MD[Market Data Adapter]
    ORCH --> FUND[Fundamentals Adapter]
    ORCH --> NEWS[News and Sentiment Adapter]

    MD --> TECH[Technical Agent]
    FUND --> FA[Fundamental Agent]
    NEWS --> NA[News Agent]
    ORCH --> RISK[Risk Agent]

    TECH --> EVIDENCE[Evidence Layer]
    FA --> EVIDENCE
    NA --> EVIDENCE
    RISK --> EVIDENCE

    EVIDENCE --> VALIDATE[Evidence Validation]
    VALIDATE --> SYNTH[Research Synthesis Agent]
    SYNTH --> EXPLAIN[Explainability Engine]
    EXPLAIN --> DB[(Supabase PostgreSQL)]

    DB --> REPORTS[Research Reports]
    DB --> PORTFOLIO[Portfolio Intelligence]
    DB --> WATCHLIST[Watchlists]
    DB --> ALERTS[Alert Engine]

    REPORTS --> FE
    PORTFOLIO --> FE
    WATCHLIST --> FE
    ALERTS --> FE

    classDef entry fill:#334155,stroke:#0F172A,color:#fff,stroke-width:1px
    classDef core fill:#1E293B,stroke:#0F172A,color:#fff,stroke-width:1px
    classDef agent fill:#3B4B6B,stroke:#1E293B,color:#fff,stroke-width:1px
    classDef data fill:#0F4C4C,stroke:#0B3A3A,color:#fff,stroke-width:1px
    classDef out fill:#4A3B1F,stroke:#332812,color:#fff,stroke-width:1px

    class U,FE entry
    class API,AUTH,ACL,ORCH core
    class TECH,FA,NA,RISK,SYNTH,EXPLAIN agent
    class MD,FUND,NEWS,EVIDENCE,VALIDATE,DB data
    class REPORTS,PORTFOLIO,WATCHLIST,ALERTS out
```

**Architecture in one line**

```
Client → API Gateway → Identity and Authorization → Analysis Orchestrator →
Provider Adapters → Specialized Agents → Evidence Layer → Validation →
AI Synthesis → Explainability → Persistent Research → Investor Actions
```

<br/>

---

## 05 · Core Workflow

| Step | Stage | System Responsibility |
|:---:|---|---|
| 01 | **Request** | Investor initiates research for a stock |
| 02 | **Resolve** | Symbol is mapped to the canonical `Stock` entity |
| 03 | **Authenticate** | Supabase token is validated when applicable |
| 04 | **Orchestrate** | Analysis Orchestrator creates the research pipeline |
| 05 | **Acquire** | Market, fundamentals, and news adapters collect source data |
| 06 | **Analyze** | Technical, Fundamental, News, and Risk agents work independently |
| 07 | **Normalize** | Agent outputs become structured evidence |
| 08 | **Validate** | Source, timestamp, completeness, and consistency are checked |
| 09 | **Synthesize** | Research Agent performs cross-domain reasoning |
| 10 | **Explain** | Conclusions are connected to supporting evidence |
| 11 | **Persist** | Research report is stored in PostgreSQL |
| 12 | **Act** | Portfolio, watchlist, and alert workflows use the research |

**Parallel analysis pipeline**

```mermaid
flowchart TB
    A[Research Request] --> B[Analysis Orchestrator]
    B --> C1[Market Data]
    B --> C2[Fundamentals]
    B --> C3[News]
    C1 --> D1[Technical Agent]
    C2 --> D2[Fundamental Agent]
    C3 --> D3[News and Sentiment Agent]
    D1 --> E[Risk Agent]
    D2 --> E
    D3 --> E
    E --> F[Evidence Aggregation]
    F --> G[Evidence Validation]
    G --> H[Research Synthesis]
    H --> I[Explainability]
    I --> J[Final Report]

    classDef start fill:#334155,stroke:#0F172A,color:#fff
    classDef mid fill:#1E293B,stroke:#0F172A,color:#fff
    classDef final fill:#0F4C4C,stroke:#0B3A3A,color:#fff

    class A,B start
    class C1,C2,C3,D1,D2,D3,E,F,G,H mid
    class J final
```

> **Why parallel agents.** Independent research domains execute concurrently, reducing latency while keeping responsibilities isolated and independently testable.

<br/>

---

## 06 · Evidence-First AI

**Traditional AI approach**

```
User Prompt → LLM → Generated Opinion
```

**StockLens approach**

```
Real Sources → Provider Adapters → Normalized Evidence → Specialized Analysis →
Validation → LLM Reasoning → Explainable Research
```

> **Non-negotiable rule.** StockLens never fabricates prices, indicators, fundamentals, news, or confidence scores. If a required provider is unavailable, the system returns a structured error instead of generating substitute data.

```json
{
  "error": "market_data_provider_not_configured",
  "detail": "The market_data provider is not configured."
}
```

<br/>

---

## 07 · Multi-Agent Intelligence

| Agent | Owns | Key Outputs |
|---|---|---|
| **Technical Agent** | Market behavior | Trend, RSI, moving averages, MACD, momentum, volatility |
| **Fundamental Agent** | Business quality | Earnings, valuation, growth, margins, leverage |
| **News Agent** | External events | News, sentiment, catalysts, event impact |
| **Risk Agent** | Downside analysis | Drawdown, volatility, liquidity, concentration |
| **Synthesis Agent** | Cross-domain reasoning | Overall research view and summary |
| **Explainability Engine** | Traceability | Conclusion → Evidence → Reason |

**Agent design**

```
Input Data → Domain-Specific Agent → Structured Findings → Evidence References
```

Each agent has a clear boundary, which keeps the system modular, testable, and provider-independent.

<br/>

---

## 08 · Technology Stack

**Frontend**

| Technology | Role |
|---|---|
| Next.js 16 | Application framework |
| React 19 | UI layer |
| TypeScript | Type-safe development |
| Tailwind CSS | Design system |
| Zustand | Client state |
| Recharts | Market visualization |
| Framer Motion | Interaction and motion |

**Backend and Platform**

| Technology | Role |
|---|---|
| Python | Backend runtime |
| Django | Application framework |
| Django REST Framework | API layer |
| Supabase Auth | Authentication and identity |
| Supabase PostgreSQL | Persistent data layer |

**AI and Data**

| Layer | Architecture |
|---|---|
| Market Data | Provider Adapter |
| Fundamentals | Provider Adapter |
| News | Provider Adapter |
| Technical Intelligence | Technical Agent |
| Risk Intelligence | Risk Agent |
| AI Research | Evidence-Grounded LLM Synthesis |
| Explainability | Evidence → Conclusion Mapping |

<br/>

---

## 09 · Database Schema

```mermaid
erDiagram
    USER ||--o| USER_PROFILE : has
    USER ||--o{ PORTFOLIO : owns
    PORTFOLIO ||--o{ PORTFOLIO_HOLDING : contains
    STOCK ||--o{ PORTFOLIO_HOLDING : identifies
    USER ||--o{ WATCHLIST : owns
    WATCHLIST ||--o{ WATCHLIST_ITEM : contains
    STOCK ||--o{ WATCHLIST_ITEM : tracks
    USER ||--o{ ALERT : creates
    STOCK ||--o{ ALERT : triggers
    USER o|--o{ ANALYSIS_REPORT : requests
    STOCK ||--o{ ANALYSIS_REPORT : analyzed_in
    STOCK ||--o{ NEWS_ARTICLE : has

    USER {
        bigint id PK
        string username UK
        string email
    }
    USER_PROFILE {
        bigint id PK
        uuid supabase_user_id UK
        string display_name
        decimal investment_amount
        string experience_level
        string risk_tolerance
        string investment_horizon
        boolean onboarding_completed
    }
    STOCK {
        bigint id PK
        string symbol UK
        string name
        string exchange
        string sector
        string industry
    }
    PORTFOLIO {
        bigint id PK
        bigint user_id FK
        string name
        datetime created_at
    }
    PORTFOLIO_HOLDING {
        bigint id PK
        bigint portfolio_id FK
        bigint stock_id FK
        decimal quantity
        decimal average_buy_price
    }
    WATCHLIST {
        bigint id PK
        bigint user_id FK
        string name
        datetime created_at
    }
    WATCHLIST_ITEM {
        bigint id PK
        bigint watchlist_id FK
        bigint stock_id FK
        datetime added_at
    }
    ALERT {
        bigint id PK
        bigint user_id FK
        bigint stock_id FK
        string alert_type
        decimal threshold
        boolean is_active
        datetime triggered_at
    }
    ANALYSIS_REPORT {
        bigint id PK
        bigint stock_id FK
        bigint user_id FK
        json technical_analysis
        json fundamental_analysis
        json news_analysis
        json risk_analysis
        string overall_signal
        text summary
        datetime created_at
    }
    NEWS_ARTICLE {
        bigint id PK
        bigint stock_id FK
        string title
        string source
        string url UK
        datetime published_at
        string sentiment
        decimal sentiment_score
    }
```

**Data ownership**

```
User
 ├── Profile
 ├── Portfolio ── Holdings ── Stock
 ├── Watchlist ── Items ───── Stock
 ├── Alerts ────────────────  Stock
 └── Research Reports ──────  Stock
```

The ownership model keeps private financial resources isolated at the database and queryset layer.

<br/>

---

## 10 · API Design

**Public Research**

```http
GET  /api/health/
GET  /api/stocks/
GET  /api/stocks/{symbol}/
GET  /api/stocks/{symbol}/technicals/
GET  /api/stocks/{symbol}/fundamentals/
GET  /api/stocks/{symbol}/news/
POST /api/stocks/{symbol}/analyze/
GET  /api/analysis/{id}/
```

**Authenticated Resources**

```http
GET    /api/profile/
PATCH  /api/profile/
GET    /api/portfolios/
POST   /api/portfolios/
PUT    /api/portfolios/{id}/
PATCH  /api/portfolios/{id}/
DELETE /api/portfolios/{id}/
GET    /api/watchlists/
POST   /api/watchlists/
PUT    /api/watchlists/{id}/
PATCH  /api/watchlists/{id}/
DELETE /api/watchlists/{id}/
GET    /api/alerts/
POST   /api/alerts/
PUT    /api/alerts/{id}/
PATCH  /api/alerts/{id}/
DELETE /api/alerts/{id}/
```

**API principles**

- REST over HTTPS
- JSON request and response format
- Django trailing-slash convention
- Bearer-token authentication
- Owner-scoped querysets
- Stable provider error envelope

<br/>

---

## 11 · Security and Ownership

```mermaid
flowchart TB
    A[Supabase Auth] --> B[Access Token]
    B --> C[Django Validation]
    C --> D[Local User Provisioning]
    D --> E[Authorization]
    E --> F[Owner-Scoped Queryset]
    F --> G[Private Resource]

    classDef step fill:#1E293B,stroke:#0F172A,color:#fff
    classDef final fill:#3B4B6B,stroke:#1E293B,color:#fff

    class A,B,C,D,E,F step
    class G final
```

**Security guarantees**

- Authentication is delegated to Supabase
- Django controls application authorization
- Supabase passwords are never stored by Django
- Private portfolios, watchlists, alerts, and reports are owner-scoped
- Provider secrets never reach the frontend
- Environment variables hold sensitive configuration
- Unauthorized private reports return `404` to avoid resource enumeration

<br/>

---

## 12 · Portfolio Intelligence

StockLens is designed to evolve from stock research into investor-level intelligence.

```mermaid
flowchart TB
    S[StockLens] --> A[Stock Research]
    S --> B[Portfolio]
    S --> C[Watchlist]
    A --> D[Risk and Alerts]
    B --> D
    C --> D
    D --> E[Investor Dashboard]

    classDef root fill:#1E293B,stroke:#0F172A,color:#fff
    classDef mid fill:#334155,stroke:#0F172A,color:#fff
    classDef final fill:#3B4B6B,stroke:#1E293B,color:#fff

    class S root
    class A,B,C,D mid
    class E final
```

| Portfolio | Watchlist | Alerts |
|---|---|---|
| Holdings | Named stock collections | Price thresholds |
| Quantity | Research access | RSI thresholds |
| Average buy price | Future event monitoring | Active/inactive state |
| Stock exposure | | Trigger timestamps |

<br/>

---

## 13 · Development

**Backend**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

cd backend
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

**Frontend**

```powershell
Copy-Item .env.local.example .env.local

npm install
npm run dev
```

**Local services**

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend | `http://127.0.0.1:8000` |
| Health API | `http://127.0.0.1:8000/api/health/` |

**Validation**

```bash
python manage.py check
python manage.py test --settings=config.test_settings

npm run lint
npx tsc --noEmit
npm run build
```

<br/>

---

## 14 · Production Safety

StockLens follows a fail-closed intelligence model.

| Condition | Response |
|---|:---:|
| Invalid input | `400` |
| Authentication failure | `401` |
| Authorization failure | `403` |
| Resource unavailable | `404` |
| Synthesis unavailable | `501` |
| Provider unavailable | `503` |
| Successful read/update | `200` |
| Resource created | `201` |
| Resource deleted | `204` |

> **Core rule.** Missing evidence is acceptable. Fabricated evidence is not.

Provider integrations are isolated behind adapters so the core system remains independent of any single data vendor.

<br/>

---

<div align="center">

## StockLens

### Research with evidence. Reason with intelligence.

<br/>

<sub>**Disclaimer:** StockLens is a research and market-intelligence platform. It does not guarantee investment returns and does not constitute financial advice.</sub>

</div>
