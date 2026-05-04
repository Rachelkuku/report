import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-all ${
      isActive
        ? 'bg-white text-primary-600 shadow-[0_2px_10px_rgb(0,0,0,0.03)]'
        : 'text-gray-500 hover:bg-white/50 hover:text-primary-500'
    }`;

  return (
    <nav className="bg-transparent border-b border-primary-100/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-primary-600 font-bold text-base tracking-tight">
              WTCSEOUL 품의 보고서 프롬프트 설계실
            </span>
          </NavLink>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              홈
            </NavLink>
            <NavLink to="/doc" className={linkClass}>
              품의·협조전
            </NavLink>
            <NavLink to="/report" className={linkClass}>
              보고서
            </NavLink>

            <NavLink to="/examples" className={linkClass}>
              예시
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
