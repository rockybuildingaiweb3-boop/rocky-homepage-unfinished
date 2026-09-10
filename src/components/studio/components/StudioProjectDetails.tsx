import React from 'react';
import { WorkItem } from '../../../types';
import { useRouter } from '../../../router/RouterContext';

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
  const { navigate } = useRouter();

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

          <div className="links flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/studio/${item.id}`);
              }}
              data-cursor="pointer"
              className="button link-wrapper interactive border border-purple-400/40 bg-purple-500/15 hover:bg-purple-500/30 text-white rounded-full px-3.5 py-1.5 transition-all duration-200 cursor-pointer"
            >
              <span className="link-title font-mono uppercase tracking-wider text-xs">
                Case Study &nearr;
              </span>
            </button>
            {item.links?.map((link, idx) => (
              <a
                key={`link-${idx}`}
                href={link.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="pointer"
                className="button link-wrapper interactive text-purple-300 hover:text-white transition-colors py-1.5"
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
