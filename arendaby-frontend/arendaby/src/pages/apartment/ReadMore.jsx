import React, { useState } from 'react';
export const ReadMore = ({ text, maxLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const isTextLong = text.length > maxLength;
    const displayText = isExpanded ? text : text.slice(0, maxLength) + (isTextLong ? '...' : '');

    return (
        <div>
            <p>{displayText}</p>
            {isTextLong && (
                <span style={{color: "blue", cursor: "pointer"}} onClick={toggleExpand}>
                    <strong>{isExpanded ? 'Скрыть' : 'Показать ещё'}</strong>
                </span>
            )}
        </div>
    );
};