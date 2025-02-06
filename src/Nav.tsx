import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  text: string;
  href: string;
}

const NavLink: FC<NavLinkProps> = ({ text, href }) => {
  return (
    <Link to={href} className='navlink'>{text}</Link>
  );
};

const Nav: FC = () => {
  return (
    <nav id='mainnav' className='container p-4 flex flex-row text-white bg-primary-800 text-lg'>
      <section id='nav-links' className='justify-end items-center flex-auto container flex flex-row'>
        <NavLink text='perijoves' href='/' />
        <NavLink text='explorer' href='/explore' />
      </section>
    </nav>
  );
};

export default Nav;