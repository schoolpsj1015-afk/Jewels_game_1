import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Sparkles,
  Trophy,
  Star,
  Flame,
  ArrowRightLeft,
  Maximize2,
  FileDown,
  Download,
  CheckCircle,
  FileText
} from 'lucide-react';
import { generateImplementationPlanPDF } from '../utils/pdfGenerator';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadedToast?: (msg: string) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onDownloadedToast }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'stars' | 'items' | 'custom' | 'plan'>('basics');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      await generateImplementationPlanPDF();
      if (onDownloadedToast) {
        onDownloadedToast('✅ 계획서 PDF 다운로드가 완료되었습니다!');
      }
    } catch (err) {
      console.error(err);
      if (onDownloadedToast) {
        onDownloadedToast('❌ PDF 다운로드 중 오류가 발생했습니다.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in select-text">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col pixel-stone-panel overflow-hidden text-[#e7decb]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1b1712] border-b-2 border-[#544333]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 pixel-gold-btn flex items-center justify-center text-[#1c1917]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-pixel font-bold text-sm sm:text-base text-[#fef08a] tracking-wider">
                탐험가 매뉴얼 & 튜토리얼 (MANUAL)
              </h2>
              <p className="text-xs text-[#d4af37] font-pixel mt-0.5">
                90S RETRO JEWEL QUEST GUIDE & SPECIFICATION
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              title="게임 시스템 및 구현 계획서 PDF 다운로드"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 pixel-gold-btn text-[#1c1917] text-xs font-pixel font-bold hover:brightness-110 active:translate-y-0.5 transition"
            >
              <FileDown className="w-4 h-4" />
              <span>{isDownloading ? '생성 중...' : '계획서 PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 pixel-stone-btn text-stone-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#14110d] border-b-2 border-[#3d3125] overflow-x-auto">
          {[
            { id: 'basics', label: '1. 기본 규칙', icon: Sparkles },
            { id: 'stars', label: '2. ⭐ 별점 시스템', icon: Star },
            { id: 'items', label: '3. 유물 & 사슬', icon: Flame },
            { id: 'custom', label: '4. 커스텀 에디터', icon: Maximize2 },
            { id: 'plan', label: '5. 📄 계획서 다운로드 (PDF)', icon: FileDown },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-pixel font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'pixel-gold-btn'
                    : 'pixel-stone-btn text-[#a89b88] hover:text-[#fde047]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 text-sm sm:text-base text-[#dcd1be] leading-relaxed bg-[#1d1813]">
          {/* BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#282119] border-2 border-[#574635] space-y-2">
                <h3 className="font-pixel font-bold text-[#fef08a] text-sm flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  승리 조건: 모든 돌판을 황금으로 변환하라!
                </h3>
                <p className="text-xs text-[#dcd1be] leading-normal font-pixel">
                  같은 종류의 픽셀 보석이 <strong>1. 일자형(가로/세로 최소 1×3, 최대 4개)</strong> 또는 <strong>2. 정사각형(2×2 네모)</strong>으로 모이면 즉시 매치되며 석판이 눈부신 <strong>황금 타일(GOLD TILE)</strong>로 변환됩니다! <strong>🚫 대각선 연결은 인정되지 않습니다.</strong> (밸런스를 위해 5개 이상은 한 번에 연결되지 않고 최대 4개까지만 안전하게 매치됩니다.)
                </p>
                <div className="mt-2 p-2.5 bg-[#17130e] border border-[#f59e0b]/40 text-xs font-pixel text-[#fde047]">
                  <strong>💎 보석 매치 배점 & 연결/낙하 규칙:</strong>
                  <ul className="list-disc list-inside mt-1 text-[#dcd1be] space-y-0.5">
                    <li>1. 일자형 매치 (1×3 또는 3×1): 300점 (기본 매치)</li>
                    <li>2. 정사각형 매치 (2×2): 600점 + <strong>고대 태양 유물(☀️)</strong> 생성!</li>
                    <li>3. 일자형 4매치 (1×4 또는 4×1): 600점 + <strong>고대 태양 유물(☀️)</strong> 생성!</li>
                    <li>🚫 대각선 매치 불가: 대각선 연결이나 X자 대각 배치는 매치로 인정되지 않습니다.</li>
                    <li>🚫 5개 이상 연결 제한: 5개 이상 과도한 연결 방지 (최대 4개 매치 적용)</li>
                    <li>⬇️ 신규 블록 낙하 제어: 새 블록이 나올 때는 무조건 아래 블록과 2블록 미만으로 연속 생성 보장!</li>
                    <li>☀️ 유물(태양석)을 보석과 스와프하면 <strong>해당 색상 보석 전체 정화 폭발</strong>!</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] space-y-1.5">
                  <strong className="text-[#fbbf24] flex items-center gap-1.5 text-xs font-pixel">
                    <ArrowRightLeft className="w-4 h-4" />
                    PC 마우스 조작법
                  </strong>
                  <p className="text-xs text-[#a89b88] font-pixel leading-normal">
                    보석을 클릭하여 선택한 후 인접한 상/하/좌/우 칸을 클릭하면 스와프됩니다. 매칭이 되지 않는 무효한 수는 원래대로 되돌아옵니다.
                  </p>
                </div>

                <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] space-y-1.5">
                  <strong className="text-[#fbbf24] flex items-center gap-1.5 text-xs font-pixel">
                    <span>📱</span>
                    모바일 터치 조작법
                  </strong>
                  <p className="text-xs text-[#a89b88] font-pixel leading-normal">
                    보석을 터치한 후 밀어내는 <strong>터치 스와이프 제스처</strong>를 사용하거나, 터치 후 하단 콘솔의 <strong>방향키(▲▼◀▶)</strong>를 눌러 스와프할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] text-xs font-pixel">
                <strong className="text-[#fde047]">1~8단계 난이도 스케일:</strong>
                <p className="text-xs text-[#a89b88] mt-1 leading-normal font-pixel">
                  Level 1 (5×5)부터 시작하여 Level 2 (6×6), Level 3 (7×7) … Level 8 (12×12)까지 보드 크기와 보석 종류, 사슬의 배치가 점점 확장됩니다.
                </p>
              </div>
            </div>
          )}

          {/* STARS */}
          {activeTab === 'stars' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#282119] border-2 border-[#574635]">
                <h3 className="font-pixel font-bold text-[#fef08a] text-sm mb-1.5 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  클리어 소요 시간별 별점(STARS) 3단계 판정
                </h3>
                <p className="text-xs text-[#dcd1be] font-pixel leading-normal">
                  각 스테이지의 전체 제한 시간 대비 얼마나 빠르게 황금 보드를 완성했는지에 따라 1~3개의 별이 수여됩니다.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3.5 p-3.5 bg-[#17130e] border-2 border-[#78350f]">
                  <div className="flex items-center text-yellow-400 text-xl font-pixel">
                    <span>★★★</span>
                  </div>
                  <div>
                    <h4 className="font-pixel font-bold text-[#fef08a] text-xs">별 3개 (마스터 탐험가)</h4>
                    <p className="text-xs text-[#a89b88] font-pixel mt-0.5">
                      전체 제한 시간의 <strong>가장 빠른 1/3 이내의 시간</strong>에 클리어 완료 (경과시간 ≤ 총시간의 33.3%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 bg-[#17130e] border-2 border-[#544333]">
                  <div className="flex items-center text-yellow-400 text-xl font-pixel">
                    <span>★★☆</span>
                  </div>
                  <div>
                    <h4 className="font-pixel font-bold text-[#fef08a] text-xs">별 2개 (숙련된 탐험가)</h4>
                    <p className="text-xs text-[#a89b88] font-pixel mt-0.5">
                      전체 제한 시간의 <strong>2/3 이내의 시간</strong>에 클리어 완료 (경과시간 ≤ 총시간의 66.7%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 bg-[#17130e] border-2 border-[#3d3125]">
                  <div className="flex items-center text-yellow-400 text-xl font-pixel">
                    <span>★☆☆</span>
                  </div>
                  <div>
                    <h4 className="font-pixel font-bold text-[#fef08a] text-xs">별 1개 (클리어 달성)</h4>
                    <p className="text-xs text-[#a89b88] font-pixel mt-0.5">
                      전체 제한 시간 내에 보드를 모두 황금으로 전환하여 생환
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ITEMS */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <h3 className="font-pixel font-bold text-[#fef08a] text-sm">특수 기믹 및 고대 파워업 도구</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 bg-[#17130e] border-2 border-[#3d3125]">
                  <span className="text-3xl">⛓️</span>
                  <div>
                    <h4 className="font-pixel font-bold text-[#fbbf24] text-xs">사슬에 묶인 보석 (Chained Gem)</h4>
                    <p className="text-xs text-[#a89b88] font-pixel mt-0.5 leading-normal">
                      자물쇠와 사슬로 고정되어 플레이어가 직접 스와프할 수 없습니다. 인접한 보석들과 3개 이상 매치되거나 해머 아이템을 사용하면 사슬이 쨍그랑 부서지며 해제됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-[#17130e] border-2 border-[#3d3125]">
                  <span className="text-3xl">🔨</span>
                  <div>
                    <h4 className="font-pixel font-bold text-[#fbbf24] text-xs">고대 유물 해머 (Relic Hammer)</h4>
                    <p className="text-xs text-[#a89b88] font-pixel mt-0.5 leading-normal">
                      해머 버튼을 누른 후 보드 위의 원하는 타일을 직접 타격하면 사슬을 즉시 부수고 해당 타일을 황금 타일로 만들어 줍니다. 구석진 타일에 유용합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-[#17130e] border-2 border-[#3d3125]">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h4 className="font-pixel font-bold text-[#fbbf24] text-xs">탐험가의 가방 (Explorer's Bag)</h4>
                    <p className="text-xs text-[#a89b88] font-pixel mt-0.5 leading-normal">
                      가능한 수가 없거나 판세를 뒤집고 싶을 때 누르면 전체 보석을 새롭게 셔플하고 무작위 1개 석판에 황금 축복을 내립니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#282119] border-2 border-[#574635]">
                <h3 className="font-pixel font-bold text-[#fef08a] text-sm mb-1.5">
                  🛠️ 나만의 커스텀 레벨 제작 (LEVEL MAKER)
                </h3>
                <p className="text-xs text-[#dcd1be] font-pixel leading-normal">
                  상단 또는 레벨 선택 창의 <strong>[+ 커스텀 레벨 추가]</strong> 버튼을 누르면 5×5부터 12×12까지 자유롭게 맵을 디자인할 수 있습니다.
                </p>
              </div>

              <ul className="list-disc pl-5 space-y-2 text-xs text-[#a89b88] font-pixel leading-normal">
                <li><strong className="text-[#fde047]">블록 상태 편집:</strong> 일반 플레이 블록, 잠금(사슬 Chained) 블록, 보이드(Void/빈 공간)를 직접 클릭하여 토글할 수 있습니다.</li>
                <li><strong className="text-[#fde047]">시간 및 보석 설정:</strong> 제한 시간(초)과 등장할 보석의 종류(4~7종)를 자유롭게 조정합니다.</li>
                <li><strong className="text-[#fde047]">로컬 브라우저 영구 보관:</strong> 만든 커스텀 맵은 브라우저에 저장되어 언제든 플레이 및 삭제가 가능합니다.</li>
              </ul>
            </div>
          )}

          {/* IMPLEMENTATION PLAN (PDF DOWNLOAD) */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#282119] border-2 border-[#b45309] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel font-bold text-[#fef08a] text-sm flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    공식 시스템 기획 및 구현 계획서 (PDF Specification)
                  </h3>
                  <span className="px-2 py-0.5 bg-[#451a03] text-[#fef08a] font-pixel text-xs border border-[#b45309]">
                    A4 규격 4페이지 구성
                  </span>
                </div>
                <p className="text-xs text-[#dcd1be] font-pixel leading-normal">
                  요청하신 난이도 1~8단계(5×5~12×12) 스케일링, 시간별 3성 별점 시스템, 커스텀 레벨 에디터, 90s 돌 픽셀아트 UI 및 모바일 2중 정렬의 전체 상세 사양이 담긴 고해상도 인쇄용 PDF 문서입니다.
                </p>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="w-full py-3.5 px-4 pixel-gold-btn text-[#1c1917] font-pixel font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl hover:brightness-110 active:translate-y-0.5 transition"
                  >
                    <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                    <span>
                      {isDownloading
                        ? '고해상도 PDF 문서 생성 중...'
                        : '📄 구현 계획서 다운로드 (.PDF 파일)'}
                    </span>
                  </button>
                  <p className="text-center text-[11px] text-[#fbbf24] font-pixel mt-1.5">
                    * 브라우저 Canvas 2D 기반 고해상도 벡터 A4(1200×1697) 렌더링으로 한글이 선명하게 출력됩니다.
                  </p>
                </div>
              </div>

              {/* 4-Page Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-pixel font-bold text-[#fbbf24]">
                      PAGE 1. 프로젝트 개요 & 루프
                    </span>
                    <span className="text-[10px] text-[#a89b88] font-pixel">P.1</span>
                  </div>
                  <ul className="text-xs text-[#a89b88] font-pixel space-y-1">
                    <li>· 90년대 CD-ROM 유적지 탐험 기획 배경</li>
                    <li>· 석판 타일 전체 황금화 점령 승리 규칙</li>
                    <li>· 7종 고대 유물 보석별 점수 및 기능 명세</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-pixel font-bold text-[#fbbf24]">
                      PAGE 2. 1~8단계 난이도 & 별점 공식
                    </span>
                    <span className="text-[10px] text-[#a89b88] font-pixel">P.2</span>
                  </div>
                  <ul className="text-xs text-[#a89b88] font-pixel space-y-1">
                    <li>· 5×5부터 12×12까지 레벨별 타일/시간 매트릭스</li>
                    <li>· 별점 판정 공식: 1/3 시간(3성), 2/3(2성), 완주(1성)</li>
                    <li>· 실제 TypeScript 판정 알고리즘 소스코드 수록</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-pixel font-bold text-[#fbbf24]">
                      PAGE 3. 커스텀 에디터 & 유물 기믹
                    </span>
                    <span className="text-[10px] text-[#a89b88] font-pixel">P.3</span>
                  </div>
                  <ul className="text-xs text-[#a89b88] font-pixel space-y-1">
                    <li>· 일반/사슬(Chained)/보이드(Void) 타일 토글</li>
                    <li>· 제한 시간 & 등장 보석(4~7종) 가변 파라미터</li>
                    <li>· 고대 유물 해머 & 탐험가의 자루 특수 기능</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#17130e] border-2 border-[#3d3125] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-pixel font-bold text-[#fbbf24]">
                      PAGE 4. 돌 픽셀 UI & 모바일 2중 정렬
                    </span>
                    <span className="text-[10px] text-[#a89b88] font-pixel">P.4</span>
                  </div>
                  <ul className="text-xs text-[#a89b88] font-pixel space-y-1">
                    <li>· 조각된 석판(Chiseled Stone) 픽셀아트 디자인</li>
                    <li>· 모바일 화면 상단 버튼 2중 정렬(2×2 Grid)</li>
                    <li>· 6개 항목 시스템 무결성 검증 & 서명(Sign-off)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#14110d] border-t-2 border-[#544333]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1.5 pixel-stone-btn text-[#fbbf24] hover:text-white text-xs font-pixel font-bold"
              title="계획서 PDF 즉시 다운로드"
            >
              <FileDown className="w-4 h-4 text-yellow-400" />
              <span>{isDownloading ? '다운로드 중...' : '계획서 PDF 다운로드'}</span>
            </button>
            <span className="hidden sm:inline text-xs text-[#a89b88] font-pixel">
              RETRO JEWEL QUEST V1.2
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 pixel-gold-btn text-xs font-pixel font-bold"
          >
            확인 (닫기)
          </button>
        </div>

      </div>
    </div>
  );
};
