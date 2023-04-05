import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <p className="site-title">PokeDex</p>
      <ul>
        <li>
          <CustomLink to="/" className="site-link">
            Pokedex
          </CustomLink>
        </li>
        <li>
          <CustomLink to="/about" className="site-link">
            About
          </CustomLink>
        </li>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  return (
    <li>
      <NavLink to={to} {...props}>
        {children}
      </NavLink>
    </li>
  );
}
