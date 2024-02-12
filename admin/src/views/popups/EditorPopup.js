import React from 'react'
import Button from '../../components/Button'

function EditorPopup() {
    return (
        <div className="confirmation-box">
            <div className="mini-window">
                <div className='heading'>
                    <h4>{heading}</h4>
                    <div className='content'>{content}</div>
                </div>

                <div className='col-2x2'>
                    <div className='col-1x2'>
                        <Button title="Save" onClick={onConfirmed} />
                    </div>
                    <div className='col-1x2'>
                        <Button title="Close" onClick={onCancel} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditorPopup
