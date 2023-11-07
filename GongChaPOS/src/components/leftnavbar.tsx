import React from 'react'
import { useNavigate  } from 'react-router-dom';

function LeftNavBar() {
    const navigate = useNavigate();

    // takes the text of click
    const navClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Prevent the default behavior of the anchor element
        event.preventDefault();

        const href = event.currentTarget.getAttribute('href');
        
        if (href) {
            navigate(href);
        }
    
    };

    return (
        <>
            <nav className='leftNavBar'>
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <a href="/cashierView" onClick={navClick}>Main Menu</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/nutritionalFacts" onClick={navClick}>Nutritional Facts</a>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default LeftNavBar;