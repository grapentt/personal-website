import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import data from './contactData';

interface ContactItem {
  label: string;
  link: string;
  icon: IconDefinition;
}

const ContactIcons: React.FC = () => (
  <ul className="icons">
    {(data as ContactItem[]).map((s) => (
      <li key={s.label}>
        <a href={s.link} aria-label={s.label}>
          <FontAwesomeIcon icon={s.icon} />
        </a>
      </li>
    ))}
  </ul>
);

export default ContactIcons;
