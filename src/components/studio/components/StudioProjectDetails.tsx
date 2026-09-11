import React from 'react';
import { WorkItem } from '../../../types';

interface StudioProjectDetailsProps {
  item: WorkItem;
  index: number;
  onClose: () => void;
}

export const StudioProjectDetails: React.FC<StudioProjectDetailsProps> = ({
  item,
  index,
  onClose,
}) => {
  return (
    <div className="details-container">
      <div className="wrapper">
        <div className="top-align">
          <div className="wrapper">
            <div className="index font-mono">
              {index < 9 ? `0${index + 1}` : index + 1}
            </div>
            <span className="line" />
            <h6 className="caption font-mono">{item.details.summary}</h6>
          </div>
        </div>

        <div className="mid-align">
          <h1 className="title breakTitleWords">{item.title}</h1>
          <button
            type="button"
            data-cursor="pointer"
            className="close-button-wrapper interactive"
            onClick={onClose}
            aria-label="Close project view"
          >
            <div className="close-button">&times;</div>
          </button>
        </div>

        <div className="bottom-align">
          <div>
            <p className="paragraph">{item.details.description}</p>
          </div>

          <div className="roles">
            <span className="line" />
            <div className="wrapper">
              {item.roles.map((role, idx) => (
                <span key={`role-${idx}`} className="role font-mono">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="links">
            {item.links?.map((link, idx) => (
              <a
                key={`link-${idx}`}
                href={link.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="pointer"
                className="button link-wrapper interactive text-purple-300 hover:text-white transition-colors"
              >
                <span className="link-title font-mono uppercase tracking-wider text-xs">
                  {link.text} &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
