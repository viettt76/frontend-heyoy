import { createElement, ReactNode } from 'react';

export function parseLinksSafe(text: string): (string | ReactNode)[] {
    const regex =
        /\b(?:https?:\/\/)?(?:www\.)?(?:localhost|\d{1,3}(?:\.\d{1,3}){3}|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?::\d+)?(?:[/?#][^\s<>"'(){}\[\],]*)?/g;

    const parts = text.split(regex);
    const links = text.match(regex);
    if (!links) return [text];

    const result: (string | ReactNode)[] = [];

    parts.forEach((part, i) => {
        result.push(part);

        if (links[i]) {
            let href = links[i];
            if (!/^https?:\/\//i.test(href)) href = `https://${href}`;

            result.push(
                createElement(
                    'a',
                    {
                        key: i,
                        href,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'text-blue-500 underline hover:text-blue-700',
                    },
                    links[i],
                ),
            );
        }
    });

    return result;
}
