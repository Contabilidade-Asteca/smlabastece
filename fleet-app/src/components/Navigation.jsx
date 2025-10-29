import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Truck, User, Fuel, CircleDot } from 'lucide-react';

/*
 * A simple navigation bar component.  It uses NavLink from
 * react-router-dom to apply active styles automatically.  Icons from
 * lucide-react complement the labels.  The layout collapses
 * gracefully on smaller screens.
 */
const Navigation = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center p-2 rounded-md hover:bg-gray-200 gap-2 ${isActive ? 'bg-gray-200 font-semibold' : ''}`;

  return (
    <nav className="bg-white shadow-md px-4 py-2">
      <ul className="flex flex-wrap gap-4">
        <li>
          <NavLink to="/" className={navLinkClass} end>
            <Home size={20} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/vehicles" className={navLinkClass}>
            <Truck size={20} />
            Veículos
          </NavLink>
        </li>
        <li>
          <NavLink to="/drivers" className={navLinkClass}>
            <User size={20} />
            Motoristas
          </NavLink>
        </li>
        <li>
          <NavLink to="/fuelings" className={navLinkClass}>
            {/* The lucide-react library does not currently export a dedicated fuel icon; we fallback to CircleDot */}
            <Fuel size={20} />
            Abastecimentos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;