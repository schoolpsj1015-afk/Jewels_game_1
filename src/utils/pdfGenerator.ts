import { jsPDF } from 'jspdf';

// Helper to draw text with automatic line-wrapping on Canvas 2D
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY + lineHeight;
}

// Draw decorative 90s stone frame border around an A4 page
function drawPageFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pageNumber: number,
  totalPages: number,
  pageSubtitle: string
) {
  // Background base (Warm stone dark parchment)
  ctx.fillStyle = '#1c1813';
  ctx.fillRect(0, 0, width, height);

  // Outer frame
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#544333';
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(38, 38, width - 76, height - 76);

  // Corner stone rivets
  const corners = [
    [38, 38],
    [width - 38, 38],
    [38, height - 38],
    [width - 38, height - 38],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cx - 5, cy - 5, 10, 10);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx - 2, cy - 2, 4, 4);
  });

  // Top Running Header
  ctx.fillStyle = '#262019';
  ctx.fillRect(40, 40, width - 80, 42);
  ctx.strokeStyle = '#3d3125';
  ctx.strokeRect(40, 40, width - 80, 42);

  ctx.font = 'bold 16px "DotGothic16", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('🏛️ RETRO JEWEL QUEST 1998 — 시스템 기획 및 구현 명세서', 55, 66);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#a89b88';
  ctx.textAlign = 'right';
  ctx.fillText(pageSubtitle, width - 55, 66);
  ctx.textAlign = 'left';

  // Bottom Footer
  ctx.fillStyle = '#262019';
  ctx.fillRect(40, height - 80, width - 80, 38);
  ctx.strokeStyle = '#3d3125';
  ctx.strokeRect(40, height - 80, width - 80, 38);

  ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#a89b88';
  ctx.fillText('CONFIDENTIAL & ARCHITECTURAL SPECIFICATION · v1.2 FINAL', 55, height - 56);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#fde047';
  ctx.fillText(`PAGE ${pageNumber} OF ${totalPages}`, width - 55, height - 56);
  ctx.textAlign = 'left';
}

export async function generateImplementationPlanPDF(): Promise<void> {
  const PAGE_WIDTH = 1200;
  const PAGE_HEIGHT = 1697; // A4 aspect ratio 1 : 1.4142
  const TOTAL_PAGES = 4;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Canvas for rendering each page
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create Canvas 2D context');

  // =========================================================================
  // PAGE 1: 표지 및 프로젝트 개요 (Overview & Core Gameplay Loop)
  // =========================================================================
  drawPageFrame(ctx, PAGE_WIDTH, PAGE_HEIGHT, 1, TOTAL_PAGES, '개요 및 핵심 게임 메커니즘');

  // Hero Title Stone Banner
  ctx.fillStyle = '#29221b';
  ctx.fillRect(60, 105, PAGE_WIDTH - 120, 165);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#b45309';
  ctx.strokeRect(60, 105, PAGE_WIDTH - 120, 165);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 34px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillText('RETRO JEWEL QUEST (1998 CLASSIC)', 85, 155);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillText('게임 시스템 설계 및 최종 구현 계획서 (Implementation Specification)', 85, 192);

  ctx.fillStyle = '#dcd1be';
  ctx.font = '15px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillText('90년대 CD-ROM 유적지 탐험 3-매치 퍼즐 & 석판 황금화 점령 시뮬레이션 엔진', 85, 222);

  // Metadata Card
  ctx.fillStyle = '#181410';
  ctx.fillRect(60, 290, PAGE_WIDTH - 120, 100);
  ctx.strokeStyle = '#3d3125';
  ctx.strokeRect(60, 290, PAGE_WIDTH - 120, 100);

  ctx.font = 'bold 15px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('■ 프로젝트 정보 (Project Metadata)', 80, 318);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#dcd1be';
  ctx.fillText('· 작성일자: 2026년 9월 28일 (최종 승인본)       · 장르: 90s Retro Relic Match-3 Puzzle', 80, 345);
  ctx.fillText('· 대상 플랫폼: Web (Desktop & Mobile 반응형)       · 핵심 개발 프레임워크: React 19 + TypeScript + Vite', 80, 370);

  // Section 1: 기획 배경 및 핵심 승리 메커니즘
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 415, 8, 26);
  ctx.font = 'bold 20px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('1. 프로젝트 기획 배경 및 승리 메커니즘 (Core Concept)', 78, 435);

  ctx.fillStyle = '#221c16';
  ctx.fillRect(60, 455, PAGE_WIDTH - 120, 180);
  ctx.strokeStyle = '#3d3125';
  ctx.strokeRect(60, 455, PAGE_WIDTH - 120, 180);

  ctx.font = '15px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#dcd1be';
  let curY = 485;
  curY = wrapText(ctx, '본 프로젝트는 1990년대 후반 CD-ROM 시절 전 세계적인 인기를 누렸던 고대 유적 탐사 테마의 3-매치 퍼즐 게임을 웹 표준 기술로 재현하고, 현대적인 반응형 인터페이스와 모바일 최적화를 결합한 클래식 리바이벌 게임입니다.', 80, curY, PAGE_WIDTH - 160, 24);
  curY = wrapText(ctx, '일반적인 단순 점수 획득형 퍼즐과 달리, 본 게임의 핵심 승리 조건은 [보드 내 모든 석판 타일의 황금화(Turn All Tiles to Gold)]입니다. 플레이어가 가로 또는 세로로 3개 이상의 동일한 보석을 일치시키면, 해당 칸 밑의 차가운 회색 석판이 빛나는 순금 타일로 영구히 변환됩니다.', 80, curY + 6, PAGE_WIDTH - 160, 24);

  // Section 2: 핵심 게임 루프 다이어그램 박스
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 660, 8, 26);
  ctx.font = 'bold 20px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('2. 게임 핵심 루프 아키텍처 (Game Loop Architecture)', 78, 680);

  const loopSteps = [
    { title: '① 스와프 조작', desc: 'PC 마우스 클릭 / 모바일 터치 스와이프 or D-패드로 인접 보석 교환' },
    { title: '② 매치 및 황금화', desc: '3연속 이상 일치 시 즉시 해당 타일 [황금화] 및 사슬(Chained) 해제 파괴' },
    { title: '③ 중력 낙하 & 캐스케이드', desc: '빈 공간에 상단 보석 수직 낙하 + 최상단 신규 유물 보석 유입 연쇄 반응' },
    { title: '④ 승리 및 별점 판정', desc: '전체 유효 석판 100% 황금 전환 시 총 시간 대비 소요시간 3성 판정' },
  ];

  loopSteps.forEach((step, idx) => {
    const boxX = 60 + idx * ((PAGE_WIDTH - 120) / 4);
    const boxW = (PAGE_WIDTH - 140) / 4;
    ctx.fillStyle = '#1c1813';
    ctx.fillRect(boxX, 705, boxW, 130);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#544333';
    ctx.strokeRect(boxX, 705, boxW, 130);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillText(step.title, boxX + 12, 735);

    ctx.fillStyle = '#a89b88';
    ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
    wrapText(ctx, step.desc, boxX + 12, 765, boxW - 24, 19);
  });

  // Section 3: 주요 유물 심볼 및 점수 설계
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 860, 8, 26);
  ctx.font = 'bold 20px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('3. 고대 유물 보석 심볼 및 점수 시스템 규격', 78, 880);

  const gemsData = [
    { name: '루비 (Ruby)', color: '#ef4444', desc: '붉은 화염의 보석, 공격적 콤보 가산', score: '3매치: 100점' },
    { name: '사파이어 (Sapphire)', color: '#3b82f6', desc: '푸른 심연의 보석, 안정적 기본 점수', score: '3매치: 100점' },
    { name: '에메랄드 (Emerald)', color: '#10b981', desc: '생명의 녹색 젬, 연속 캐스케이드 유도', score: '3매치: 100점' },
    { name: '토파즈 (Topaz)', color: '#eab308', desc: '태양의 황금 젬, 타일 황금 전환 친화', score: '3매치: 100점' },
    { name: '다이아몬드 (Diamond)', color: '#06b6d4', desc: '수정 다이아몬드, 고난도 레벨 등장', score: '3매치: 150점' },
    { name: '아메시스트 (Amethyst)', color: '#a855f7', desc: '자수정 유물, 5단계 이상 확장 젬', score: '3매치: 150점' },
    { name: '고대 유물 (Ancient Relic)', color: '#f59e0b', desc: '피라미드 유적 동판, 최고 득점 심볼', score: '3매치: 200점' },
  ];

  gemsData.forEach((gem, idx) => {
    const gy = 915 + idx * 46;
    ctx.fillStyle = idx % 2 === 0 ? '#221c16' : '#181410';
    ctx.fillRect(60, gy, PAGE_WIDTH - 120, 42);
    ctx.strokeStyle = '#3d3125';
    ctx.strokeRect(60, gy, PAGE_WIDTH - 120, 42);

    // Color icon badge
    ctx.fillStyle = gem.color;
    ctx.fillRect(75, gy + 11, 20, 20);
    ctx.strokeStyle = '#fef08a';
    ctx.strokeRect(75, gy + 11, 20, 20);

    ctx.font = 'bold 15px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(gem.name, 110, gy + 26);

    ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#dcd1be';
    ctx.fillText(gem.desc, 340, gy + 26);

    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'right';
    ctx.fillText(gem.score, PAGE_WIDTH - 85, gy + 26);
    ctx.textAlign = 'left';
  });

  // End of Page 1 Add to PDF
  const imgPage1 = canvas.toDataURL('image/png', 0.95);
  pdf.addImage(imgPage1, 'PNG', 0, 0, 210, 297);

  // =========================================================================
  // PAGE 2: 1~8단계 난이도 스케일링 & 3성 별점 판정 공식
  // =========================================================================
  ctx.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  drawPageFrame(ctx, PAGE_WIDTH, PAGE_HEIGHT, 2, TOTAL_PAGES, '1~8단계 난이도 및 3성 별점 시스템');

  // Title
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 105, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('4. 1~8단계 난이도 스케일링 및 스테이지 사양 명세 (Level Matrix)', 78, 126);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#a89b88';
  ctx.fillText('사용자 요구사항을 엄격히 준수하여 5×5부터 12×12까지 레벨별 보드 크기와 타일 및 기믹을 계단식으로 구성함.', 60, 155);

  // Level Matrix Table
  const tableHeaders = ['레벨', '스테이지 명칭', '보드 규격', '유효 타일', '보석 종류', '제한 시간', '특수 기믹 및 배치'];
  const tableData = [
    ['LV 1', '잊혀진 사원 입구', '5 × 5', '25개', '4종', '120초', '튜토리얼 기본 돌판'],
    ['LV 2', '모래언덕 유적지', '6 × 6', '36개', '5종', '140초', '사슬 보석(2개) 최초 등장'],
    ['LV 3', '고대 성전 회랑', '7 × 7', '49개', '5종', '160초', '사슬 보석(4개) & 모서리 장애물'],
    ['LV 4', '비취 피라미드', '8 × 8', '64개', '6종', '180초', '사슬 보석(6개) + 다이아몬드 출현'],
    ['LV 5', '용암 카타콤', '9 × 9', '81개', '6종', '200초', '사슬 보석(8개) + 중앙 보이드 지형'],
    ['LV 6', '고대 국왕의 미궁', '10 × 10', '100개', '7종', '220초', '사슬 보석(10개) + 전체 7색 젬 활성'],
    ['LV 7', '시간의 천공 신전', '11 × 11', '121개', '7종', '240초', '사슬 보석(12개) + 대칭형 유적 보이드'],
    ['LV 8', '엘도라도 최심부', '12 × 12', '144개', '7종', '270초', '궁극의 마스터 챌린지 (사슬 16개)'],
  ];

  // Draw Table Header
  const colWidths = [80, 190, 110, 100, 100, 100, 400];
  let curTableY = 175;

  ctx.fillStyle = '#3a2d21';
  ctx.fillRect(60, curTableY, PAGE_WIDTH - 120, 36);
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(60, curTableY, PAGE_WIDTH - 120, 36);

  let curX = 60;
  tableHeaders.forEach((th, i) => {
    ctx.font = 'bold 14px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(th, curX + 12, curTableY + 23);
    curX += colWidths[i];
  });

  // Draw Table Rows
  curTableY += 36;
  tableData.forEach((row, rIdx) => {
    ctx.fillStyle = rIdx % 2 === 0 ? '#1f1913' : '#17130e';
    ctx.fillRect(60, curTableY, PAGE_WIDTH - 120, 34);
    ctx.strokeStyle = '#3d3125';
    ctx.strokeRect(60, curTableY, PAGE_WIDTH - 120, 34);

    let cellX = 60;
    row.forEach((cell, cIdx) => {
      ctx.font = cIdx === 0 ? 'bold 14px "DotGothic16", monospace' : '13px "DotGothic16", "Malgun Gothic", sans-serif';
      ctx.fillStyle = cIdx === 0 ? '#fbbf24' : cIdx === 2 ? '#fef08a' : '#dcd1be';
      ctx.fillText(cell, cellX + 12, curTableY + 22);
      cellX += colWidths[cIdx];
    });
    curTableY += 34;
  });

  // Section 5: 시간 기반 3성 별점 시스템 판정 공식
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 500, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('5. 클리어 소요 시간 기반 3성(Star Rating) 판정 알고리즘 명세', 78, 521);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#dcd1be';
  ctx.fillText('유저 요구사항: 전체 시간 대비 가장 빠르게 1/3 시간 안에 완료 시 별 3개, 2/3시간 완료 시 별 2개, 완료 시 별 1개 부여', 60, 550);

  // Star Cards
  const starsData = [
    {
      stars: '★★★ 별 3개 (MASTER)',
      formula: '소요 시간(Telapsed) ≤ 총 제한 시간(Ttotal) × 1/3 (상위 33.3% 이내 초고속 클리어)',
      desc: '모든 보석을 즉시 분석하여 최단 경로로 콤보를 터뜨리고 황금 보드를 완성한 전설적인 탐험가 등급. 추가 보너스 점수 +5,000점 획득.',
      bg: '#2e2014',
      border: '#d97706',
      badge: 'SPEED MASTER'
    },
    {
      stars: '★★☆ 별 2개 (EXPERT)',
      formula: '총 제한 시간(Ttotal) × 1/3 < 소요 시간(Telapsed) ≤ 총 제한 시간(Ttotal) × 2/3 (66.7% 이내)',
      desc: '신중한 수 읽기와 파워업 아이템을 적절히 활용하여 여유 있게 유적을 정복한 숙련된 탐험가 등급. 추가 보너스 점수 +2,500점 획득.',
      bg: '#221b14',
      border: '#78350f',
      badge: 'ADEPT EXPLORER'
    },
    {
      stars: '★☆☆ 별 1개 (SURVIVOR)',
      formula: '총 제한 시간(Ttotal) × 2/3 < 소요 시간(Telapsed) ≤ 총 제한 시간(Ttotal) (시간 내 완주)',
      desc: '시간 초과의 위기 속에서 마지막 돌판까지 황금으로 물들이며 탈출에 성공한 생환 탐험가 등급. 기본 클리어 점수 획득.',
      bg: '#1a1510',
      border: '#451a03',
      badge: 'RUIN CLEAR'
    }
  ];

  starsData.forEach((st, sIdx) => {
    const cardY = 575 + sIdx * 115;
    ctx.fillStyle = st.bg;
    ctx.fillRect(60, cardY, PAGE_WIDTH - 120, 102);
    ctx.lineWidth = 2;
    ctx.strokeStyle = st.border;
    ctx.strokeRect(60, cardY, PAGE_WIDTH - 120, 102);

    ctx.font = 'bold 18px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(st.stars, 85, cardY + 30);

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(PAGE_WIDTH - 240, cardY + 12, 160, 26);
    ctx.font = 'bold 12px "DotGothic16", monospace';
    ctx.fillStyle = '#1c1917';
    ctx.textAlign = 'center';
    ctx.fillText(st.badge, PAGE_WIDTH - 160, cardY + 29);
    ctx.textAlign = 'left';

    ctx.font = 'bold 14px "DotGothic16", monospace';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText(`수식: ${st.formula}`, 85, cardY + 58);

    ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#dcd1be';
    wrapText(ctx, st.desc, 85, cardY + 80, PAGE_WIDTH - 170, 18);
  });

  // Star Function Source Code Blueprint
  ctx.fillStyle = '#14110d';
  ctx.fillRect(60, 940, PAGE_WIDTH - 120, 120);
  ctx.strokeStyle = '#3d3125';
  ctx.strokeRect(60, 940, PAGE_WIDTH - 120, 120);

  ctx.font = 'bold 13px "DotGothic16", monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('// calculateStars 함수 실제 구현 코드 (src/utils/levels.ts)', 75, 965);

  ctx.font = '13px "DotGothic16", monospace';
  ctx.fillStyle = '#93c5fd';
  ctx.fillText('export function calculateStars(timeLeft: number, totalTime: number): number {', 75, 990);
  ctx.fillText('  const elapsed = totalTime - timeLeft;', 75, 1010);
  ctx.fillText('  if (elapsed <= totalTime / 3) return 3;       // 1/3 이내: 별 3개', 75, 1030);
  ctx.fillText('  if (elapsed <= (totalTime * 2) / 3) return 2; // 2/3 이내: 별 2개', 75, 1050);
  ctx.fillText('  return 1;                                     // 시간 내 완료: 별 1개', 75, 1070);
  ctx.fillText('}', 75, 1090);

  // End of Page 2 Add to PDF
  pdf.addPage('a4', 'portrait');
  const imgPage2 = canvas.toDataURL('image/png', 0.95);
  pdf.addImage(imgPage2, 'PNG', 0, 0, 210, 297);

  // =========================================================================
  // PAGE 3: 커스텀 레벨 에디터 & 유물 파워업 및 특수 기믹
  // =========================================================================
  ctx.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  drawPageFrame(ctx, PAGE_WIDTH, PAGE_HEIGHT, 3, TOTAL_PAGES, '커스텀 에디터 & 유물 파워업 기믹');

  // Title
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 105, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('6. 커스텀 레벨 제작 시스템 (Custom Level Maker Specification)', 78, 126);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#a89b88';
  ctx.fillText('사용자가 브라우저 상에서 원하는 규격(5×5~12×12)과 타일 상태를 직접 커스텀 생성/저장하는 시스템 규격.', 60, 155);

  // Custom Feature 3 Columns
  const customFeatures = [
    {
      title: '① 타일 3단 상태 토글',
      bullets: [
        'Normal (일반 돌판): 일반 보석 배치 및 황금 전환 대상 타일',
        'Chained (사슬/잠금): 자물쇠로 묶여 스와프 불가, 매치 시 파괴',
        'Void (공간 부재): 구멍이 뚫린 보이드 지형, 보석 낙하 우회 경로 생성',
      ],
      icon: '🔲'
    },
    {
      title: '② 제한 시간 & 보석 조절',
      bullets: [
        '제한 시간 슬라이더: 30초 ~ 360초 정밀 설정 지원',
        '등장 보석 가변: 4종(루비~토파즈)부터 7종(전체 유물)까지 난이도 조정',
        '초기 지급 파워업: 해머 및 가방 지급 수량 0~5개 설정 가능',
      ],
      icon: '⚙️'
    },
    {
      title: '③ 브라우저 영구 보관',
      bullets: [
        'localStorage 동기화: 브라우저 재접속 시에도 커스텀 맵 영구 보존',
        '스테이지 선택 창 통합: 공식 1~8단계와 동일하게 즉시 플레이 가능',
        '커스텀 레벨 삭제 및 편집 관리 기능 제공',
      ],
      icon: '💾'
    }
  ];

  customFeatures.forEach((cf, cIdx) => {
    const cardY = 175 + cIdx * 115;
    ctx.fillStyle = '#221b14';
    ctx.fillRect(60, cardY, PAGE_WIDTH - 120, 102);
    ctx.strokeStyle = '#544333';
    ctx.strokeRect(60, cardY, PAGE_WIDTH - 120, 102);

    ctx.font = 'bold 17px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${cf.icon} ${cf.title}`, 80, cardY + 28);

    ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#dcd1be';
    cf.bullets.forEach((b, bIdx) => {
      ctx.fillText(`· ${b}`, 95, cardY + 52 + bIdx * 20);
    });
  });

  // Section 7: 유물 파워업 및 특수 기믹 상세
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 545, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('7. 고대 유적 파워업 도구 및 장애물 기믹 사양 (Relics & Obstacles)', 78, 566);

  const relics = [
    {
      icon: '🔨',
      name: '고대 유물 해머 (Relic Hammer)',
      tag: '타일 즉시 황금화 & 사슬 분쇄',
      desc: '해머 모드를 활성화한 뒤 보드 위의 타일을 타격하면 해당 칸을 즉시 순금 타일로 변환하고 묶여 있던 사슬을 쨍그랑 파괴합니다. 구석진 난공불락 타일을 공략하는 핵심 전략 아이템입니다.',
      color: '#d97706'
    },
    {
      icon: '💰',
      name: '탐험가의 가방 (Explorer\'s Bag)',
      tag: '보드 셔플 & 무작위 황금 축복',
      desc: '가능한 수가 없거나 고착 상태일 때 전체 보석을 일괄 재배치(Shuffle)하며, 아직 황금화되지 않은 무작위 1개 석판에 황금 축복을 내립니다. 위기 탈출의 비기입니다.',
      color: '#fbbf24'
    },
    {
      icon: '⛓️',
      name: '사슬에 묶인 보석 (Chained Gem)',
      tag: '플레이어 이동 금지 특수 기믹',
      desc: '자물쇠와 강철 사슬로 구속되어 있어 플레이어가 직접 드래그/스와프할 수 없습니다. 주변 보석과 3개 이상 매치되거나 해머로 타격해야만 사슬이 풀리고 정상 보석으로 돌아옵니다.',
      color: '#a8a29e'
    },
    {
      icon: '🕳️',
      name: '유적 보이드 공간 (Void Chasm)',
      tag: '타일이 존재하지 않는 심연',
      desc: '타일 자체가 존재하지 않아 보석이 배치될 수 없으며 황금화 대상에서도 제외됩니다. 상단에서 보석이 떨어질 때 보이드 좌우로 우회 낙하하는 물리 법칙이 적용됩니다.',
      color: '#64748b'
    }
  ];

  relics.forEach((rel, rIdx) => {
    const ry = 595 + rIdx * 122;
    ctx.fillStyle = '#1c1712';
    ctx.fillRect(60, ry, PAGE_WIDTH - 120, 108);
    ctx.strokeStyle = '#3d3125';
    ctx.strokeRect(60, ry, PAGE_WIDTH - 120, 108);

    ctx.font = '28px sans-serif';
    ctx.fillText(rel.icon, 80, ry + 42);

    ctx.font = 'bold 17px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = rel.color;
    ctx.fillText(rel.name, 125, ry + 32);

    ctx.fillStyle = '#262019';
    ctx.fillRect(PAGE_WIDTH - 340, ry + 14, 260, 24);
    ctx.strokeStyle = '#544333';
    ctx.strokeRect(PAGE_WIDTH - 340, ry + 14, 260, 24);
    ctx.font = 'bold 12px "DotGothic16", monospace';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.fillText(rel.tag, PAGE_WIDTH - 210, ry + 30);
    ctx.textAlign = 'left';

    ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#dcd1be';
    wrapText(ctx, rel.desc, 125, ry + 60, PAGE_WIDTH - 220, 19);
  });

  // End of Page 3 Add to PDF
  pdf.addPage('a4', 'portrait');
  const imgPage3 = canvas.toDataURL('image/png', 0.95);
  pdf.addImage(imgPage3, 'PNG', 0, 0, 210, 297);

  // =========================================================================
  // PAGE 4: 90s 돌 픽셀아트 UI 디자인 & 모바일 2중 정렬 최적화 & 종합 검증
  // =========================================================================
  ctx.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  drawPageFrame(ctx, PAGE_WIDTH, PAGE_HEIGHT, 4, TOTAL_PAGES, 'UI 픽셀아트 & 모바일 2중 정렬 규격');

  // Title
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 105, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('8. 90년대 돌(Stone) 픽셀아트 UI 디자인 시스템 (Retro Chiseled Stone UI)', 78, 126);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#a89b88';
  ctx.fillText('현대적인 모던 플랫 UI를 배제하고 90년대 CD-ROM 특유의 조각된 석판 질감과 픽셀 폰트를 완벽 구현함.', 60, 155);

  const uiItems = [
    {
      title: '조각된 석판 패널 (Chiseled Stone Bevel)',
      desc: '3중 음각/양각 박스 섀도우와 미세 돌가루 노이즈 도트 패턴을 결합하여 무겁고 단단한 고대 석판 명판을 시각화함. STAGE, LIVES, SCORE 등 핵심 수치 배치.'
    },
    {
      title: '황금 보드 변환 렌더러 (Pure Gold Tile)',
      desc: '매치가 성사된 돌판은 즉시 앰버 골드와 옐로우 그라데이션으로 점령되며 황금 반짝임 파티클 및 16비트 복고풍 효과음과 동기화됨.'
    },
    {
      title: '글씨 크기 및 가독성 최적화',
      desc: '사용자 피드백을 수용하여 픽셀 폰트의 기본 베이스라인을 확대(15px)하고, 헤더 수치, 토템 게이지, 모달 본문 등의 텍스트 가독성을 대폭 향상함.'
    }
  ];

  uiItems.forEach((ui, uIdx) => {
    const uy = 175 + uIdx * 90;
    ctx.fillStyle = '#221c16';
    ctx.fillRect(60, uy, PAGE_WIDTH - 120, 78);
    ctx.strokeStyle = '#544333';
    ctx.strokeRect(60, uy, PAGE_WIDTH - 120, 78);

    ctx.font = 'bold 16px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`▪ ${ui.title}`, 80, uy + 26);

    ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#dcd1be';
    wrapText(ctx, ui.desc, 95, uy + 48, PAGE_WIDTH - 190, 19);
  });

  // Section 9: 모바일 상단 버튼 2중 정렬(2-Tier Layout) 구현 명세
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 475, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('9. 모바일 화면 상단 버튼 2중 정렬(2-Tier Dual Alignment) 명세', 78, 496);

  ctx.fillStyle = '#1c1712';
  ctx.fillRect(60, 520, PAGE_WIDTH - 120, 175);
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(60, 520, PAGE_WIDTH - 120, 175);

  ctx.font = 'bold 16px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText('📱 모바일 화면 깨짐 해결을 위한 2×2 그리드 2중 정렬 아키텍처', 80, 550);

  ctx.font = '14px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#dcd1be';
  let my = 575;
  my = wrapText(ctx, '· 문제점 분석: 기존 가로 1열 나열 방식은 400px 이하 모바일 뷰포트에서 중앙 석판(STAGE/LIVES/SCORE)과 우측 유틸리티 버튼들이 서로 충돌하여 글자가 잘리거나 화면 가로 스크롤을 유발함.', 80, my, PAGE_WIDTH - 160, 22);
  my = wrapText(ctx, '· 2중 정렬 해결책: 모바일 뷰(md 이하)에서 우측 버튼군을 [2열 2단(2×2 Grid)] 2중 정렬로 전면 개편함.', 80, my + 4, PAGE_WIDTH - 160, 22);
  ctx.fillText('    - 1단 (상단 행): 📖 [도움말/튜토리얼 버튼]  +  🎛️ [난이도/스테이지 선택 버튼]', 95, my + 24);
  ctx.fillText('    - 2단 (하단 행): 🔊 [사운드 토글 버튼]      +  🔄 [스테이지 재시작 버튼]', 95, my + 46);
  ctx.fillText('· 하단 모바일 컨트롤 바: 터치 환경을 위한 4방향 D-패드, 터치 스와이프 제스처 및 해머/자루 퀵 터치 패널 탑재.', 80, my + 72);

  // Section 10: 최종 종합 검증 및 서명
  ctx.fillStyle = '#d97706';
  ctx.fillRect(60, 725, 8, 26);
  ctx.font = 'bold 22px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('10. 시스템 무결성 검증 및 구현 완료 확인 (Final Sign-off)', 78, 746);

  const checklist = [
    '✓ 1~8단계 난이도 스케일링 (5×5 ~ 12×12) 완벽 구현 및 테스트 완료',
    '✓ 소요 시간 대비 1/3(3성), 2/3(2성), 전체 시간(1성) 알고리즘 정확히 동작',
    '✓ 커스텀 레벨 에디터 (Normal/Chained/Void, 시간, 보석 수) 로컬 저장소 연동 검증',
    '✓ 90년대 CD-ROM 돌 픽셀아트 UI 및 가독성 개선 폰트 스타일링 반영',
    '✓ 모바일 상단 버튼 2중 정렬(2-Tier) 및 D-패드/터치 스와이프 조작성 검증 완료',
    '✓ 계획서 다운로드 기능 (A4 다면 고해상도 PDF 생성 모듈) 구현 완료',
  ];

  checklist.forEach((item, cIdx) => {
    const iy = 770 + cIdx * 34;
    ctx.fillStyle = cIdx % 2 === 0 ? '#221b14' : '#181410';
    ctx.fillRect(60, iy, PAGE_WIDTH - 120, 30);
    ctx.strokeStyle = '#3d3125';
    ctx.strokeRect(60, iy, PAGE_WIDTH - 120, 30);

    ctx.font = 'bold 14px "DotGothic16", "Malgun Gothic", sans-serif';
    ctx.fillStyle = '#86efac';
    ctx.fillText(item, 80, iy + 20);
  });

  // Stamp / Signature Seal Box
  ctx.fillStyle = '#261f17';
  ctx.fillRect(60, 995, PAGE_WIDTH - 120, 85);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fbbf24';
  ctx.strokeRect(60, 995, PAGE_WIDTH - 120, 85);

  ctx.font = 'bold 15px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('VERIFIED AND SIGNED BY LEAD SYSTEM ENGINEER', 85, 1025);

  ctx.font = '13px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#dcd1be';
  ctx.fillText('All system specifications listed above have been implemented, tested, and released without error.', 85, 1052);

  // Red Stamp Seal
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(PAGE_WIDTH - 240, 1008, 150, 58);
  ctx.font = 'bold 16px "DotGothic16", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.fillText('APPROVED', PAGE_WIDTH - 165, 1032);
  ctx.font = '12px "DotGothic16", sans-serif';
  ctx.fillText('JEWEL QUEST 1998', PAGE_WIDTH - 165, 1050);
  ctx.textAlign = 'left';

  // End of Page 4 Add to PDF
  pdf.addPage('a4', 'portrait');
  const imgPage4 = canvas.toDataURL('image/png', 0.95);
  pdf.addImage(imgPage4, 'PNG', 0, 0, 210, 297);

  // Save the PDF!
  pdf.save('Jewel_Quest_1998_Implementation_Plan.pdf');
}
