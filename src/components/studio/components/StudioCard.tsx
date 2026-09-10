import React from 'react';
import { WorkItem } from '../../../types';

interface StudioCardProps {
  item: WorkItem;
  index: number;
  isActive: boolean;
  isAmbient: boolean;
  isTextHidden: boolean;
  onSelect: (index: number) => void;
  itemRef: (el: HTMLDivElement | null) => void;
  imgRef: (el: HTMLImageElement | null) => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  item,
  index,
  isActive,
  isAmbient,
  isTextHidden,
  onSelect,
  itemRef,
  imgRef,
}) => {
  return (
    <li>
      <div
        ref={itemRef}
        data-cursor="view"
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        aria-label={`View project details for ${item.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(index);
          }
        }}
        className={`list-item clickable passive ${isActive ? 'active' : ''} ${
          isAmbient ? 'ambient' : ''
        }`}
        onClick={() => onSelect(index)}
      >
        <div className="img-wrapper">
          <img
            ref={imgRef}
            src={item.image || `/assets/imgs/work-back/${item.id}/cover.jpg`}
            alt={`${item.title} Background`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        <div className={`text-top-wrapper ${isTextHidden ? 'hidden' : ''}`}>
          <p className="item-index font-mono">
            {index < 9 ? `0${index + 1}` : `${index + 1}`}
          </p>
        </div>

        <div className={`text-wrapper ${isTextHidden ? 'hidden' : ''}`}>
          <h1 className="item-title">{item.title}</h1>
          <div className="inline-wrapper">
            <button
              type="button"
              className="button item-link interactive"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(index);
              }}
            >
              view &rarr;
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
