import React from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill';
import QuerySets from '../../controllers/dashboard.controller';

let TEXT_EDITOR_METADATA = {}
function TextEditor({value, onChange}) {
    const [API] = React.useState(new QuerySets())
    const editorRef = React.useRef(null);
    const [editorKey] = React.useState(Math.floor(Math.random() * (900000 - 10000 + 1)) + 10000)

    React.useEffect(() => {
        if (TEXT_EDITOR_METADATA[editorKey] === undefined) TEXT_EDITOR_METADATA[editorKey] = false;
        if (TEXT_EDITOR_METADATA[editorKey]) return;

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Write your content here...',
        });

        quill.clipboard.dangerouslyPasteHTML(value);

        quill.on('text-change', () => {
            onChange(quill.root.innerText)
        });

        // Cleanup the Quill instance when the component is unmounted
        return () => {
            TEXT_EDITOR_METADATA[editorKey] = true
            try { quill.destroy(); } catch (ex) { }
        };
    }, []);

    React.useEffect(() => {
        if (TEXT_EDITOR_METADATA[editorKey] === undefined) TEXT_EDITOR_METADATA[editorKey] = false;
        TEXT_EDITOR_METADATA[editorKey] = false
    }, [API]);
    return (
        <div ref={editorRef}></div>
    )
}

export default TextEditor
