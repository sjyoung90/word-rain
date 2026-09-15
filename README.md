# Word Rain (Typing Game)

> 🚧 **파킹됨** (2026-09-15) — 재미/수익화 판단 후 잠시 보류. 나중에 각도 바꿔서 돌아올 수 있음.

한컴타자 스타일의 웹 타자 게임. 위에서 떨어지는 단어를 타이핑해서 지운다.

## 개발 시작

```bash
pnpm dev
```

http://localhost:3000

## 폴더 구조

```
src/
├── app/
│   └── page.tsx              # 게임 phase 관리 (idle/playing/gameOver)
├── components/game/
│   ├── StartScreen.tsx       # 시작 화면
│   ├── GameScreen.tsx        # 플레이 화면 (HUD + 플레이필드)
│   ├── GameOverScreen.tsx    # 종료 화면
│   └── FallingWord.tsx       # 개별 떨어지는 단어
├── hooks/
│   └── useGameLoop.ts        # 게임 루프 (⭐ 핵심 로직)
├── data/
│   └── words.json            # 영단어 100개
└── types/
    └── game.ts               # 타입 정의 + 상수
```

## 게임 로직 개요

`useGameLoop.ts`가 게임 상태를 모두 관리한다. `useReducer` + 3개의 `useEffect`로 구성.

### 리듀서 액션
- **TICK**: 매 프레임 실행. 모든 단어 y좌표 이동, 바닥 닿은 단어는 제거하고 `lives--`. `lives`가 0이 되면 `phase: "gameOver"`.
- **SPAWN**: `words.length < MAX_CONCURRENT_WORDS`일 때 새 단어 추가. 속도는 `elapsedMs`에 비례해 증가 (0.05 → 최대 0.2).
- **KEY_PRESS**: 자동 매칭. active가 없으면 첫 글자로 시작하는 단어를 찾아 active로 지정. active가 있으면 다음 글자 매칭 → `typedCount++`. 단어 완성 시 점수(길이 × 2) 획득 후 제거.
- **RESET**: 초기 상태로.

### 3개의 useEffect
1. **rAF 루프**: `requestAnimationFrame`으로 매 프레임 `TICK` dispatch + 1500ms마다 `SPAWN` dispatch. `deltaMs`는 백그라운드 탭 복귀 대응으로 100ms로 clamp.
2. **게임 오버 트리거**: `phase === "gameOver"`가 되면 부모의 `onGameOver(score)` 호출. `gameOverCalledRef`로 중복 호출 방지.
3. **키보드 리스너**: `window.keydown`에서 알파벳 키만 `KEY_PRESS` dispatch.

### 튜닝 상수 (`types/game.ts` + hook 상단)
- `INITIAL_LIVES` = 3
- `MAX_CONCURRENT_WORDS` = 5
- `PLAYFIELD_WIDTH` / `PLAYFIELD_HEIGHT` = 800 / 600
- `SPAWN_INTERVAL_MS` = 1500
- 속도 램프: 0.05 → 0.2 (60초 동안 선형 증가)

## MVP 이후 (v0.2+)

- 난이도 곡선 (시간 지날수록 스폰 빠르게, speed ↑)
- 정확도 / WPM 표시
- 사용자 단어장 등록 & 공유
- 로그인 (Next-Auth)
- 랭킹 / 리더보드
- 사운드 & 파티클 이펙트
- 한글 지원 (`compositionstart/end` 처리)

## 배포

Vercel에 push하면 자동 배포. `pnpm build`로 로컬 빌드 검증 가능.
