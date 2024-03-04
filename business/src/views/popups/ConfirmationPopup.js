import React from 'react'
import Button from '../../components/Button'

function ConfirmationPopup({heading, content, onConfirmed, onCancel, buttons}) {
    return (
        <div className="confirmation-box">
            <div className="mini-window">
                <div className='heading'>
                    <h4>{heading}</h4>
                    <div className='content'>{content}</div>
                </div>

                <div className='col-2x2'>
                    <div className='col-1x2'>
                        {buttons && <Button special={'special'} title={buttons[0]} onClick={onConfirmed} />}
                        {!buttons && <Button special={'special'} title="Yes" onClick={onConfirmed} />}
                    </div>
                    <div className='col-1x2'>
                        {buttons && <Button title={buttons[1]} onClick={onCancel} />}
                        {!buttons && <Button title="No" onClick={onCancel} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup
