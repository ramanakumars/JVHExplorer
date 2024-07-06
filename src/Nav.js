import {Link} from 'react-router-dom';

export default function Nav() {
    return (
        <nav id='mainnav' className='container p-4 flex flex-row text-white bg-primary-800 text-lg'>
            <section id='nav-links' className='justify-end items-center flex-auto container flex flex-row'>
                <NavLink text='home' href='/' />
                <NavLink text='explorer' href='/explore' />
            </section>
        </nav>
    )
}

function NavLink({ text, href }) {
    return (
        <Link to={href} className='navlink'>{text}</Link>
    )
}
