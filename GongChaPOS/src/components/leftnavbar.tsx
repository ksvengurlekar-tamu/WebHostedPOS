import React from 'react'

function LeftNavBar() {
    return (
        <>
            <nav className='leftNavBar'>
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <a className='nav-link' href='/cashierView'>Main Menu</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link' href='/cashierView'>Recipes</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link' href='/cashierView'>Time Sheet</a>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default LeftNavBar;