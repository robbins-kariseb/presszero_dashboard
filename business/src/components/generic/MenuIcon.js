import React from 'react'
import apps_0 from '../../images/menu-icon-apps-selected.png';
import apps_1 from '../../images/menu-icon-apps.png';

import message_0 from '../../images/menu-icon-message-selected.png';
import message_1 from '../../images/menu-icon-message.png';

import report_0 from '../../images/menu-icon-report-selected.png';
import report_1 from '../../images/menu-icon-report.png';

const DICT = {
    "apps": [apps_0, apps_1],
    "message": [message_0, message_1],
    "report": [report_0, report_1],
}

function MenuIcon({icon, selected}) {
    const def = DICT[icon][1]
    const sel = DICT[icon][0]
    return (
        <div className='menu-icon'>
            <img src={selected ? sel : def} alt={icon} />
        </div>
    )
}

export default MenuIcon
