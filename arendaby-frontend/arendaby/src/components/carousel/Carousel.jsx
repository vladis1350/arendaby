import "./Carousel.css"
import {Children, cloneElement, useEffect, useState} from "react";
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

const PAGE_WIDTH = 300
export const Carousel = ({children}) => {
    const [pages, setPages] = useState([])
    const [offset, setOffset] = useState(0)

    const handleLeftArrowClick = () => {
        setOffset((currentOffset) => {
            return Math.min(currentOffset + PAGE_WIDTH, 0)
        })
    }

    const handleRightArrowClick = () => {
        setOffset((currentOffset) => {
            const newOffset = currentOffset - PAGE_WIDTH
            const maxOffset = -(PAGE_WIDTH * (pages.length - 1))
            return Math.max(newOffset, maxOffset)
        })
    }

    useEffect(() => {
        setPages(
            (Children.map(children, child => {
                return cloneElement(child, {
                    style: {
                        height: '100%',
                        maxWidth: `${PAGE_WIDTH}px`,
                        minWidth: `${PAGE_WIDTH}px`,
                    },
                })
            }))
        )
    }, []);

    return (
        <div className="main-container">
            <FaChevronLeft className="arrow" onClick={handleLeftArrowClick}/>
            <div className="window">
                <div className="all-pages-container"
                     style={{
                         transform: `translateX(${offset}px)`,
                     }}>
                    {pages}
                </div>
            </div>
            <FaChevronRight className="arrow" onClick={handleRightArrowClick}/>
        </div>
    )
}