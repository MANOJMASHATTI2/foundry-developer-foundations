/* JSX */
/* @jsxImportSource preact */
import { useEffect } from "preact/hooks";
import { postMessage } from "../../../lib/vscode";
import { MachineStatus } from "../../../lib/backend-types";
import { GeneralMessageBubble } from "../GeneralMessageBubble";
import { useContentFromLocalFile } from "../../../hooks/useContentFromLocalFile";
import { FileSymlink } from "lucide-preact";

type DataType = {
  approved: boolean;
  file: string;
  messages: {system?: string, user?: string}[];
  reviewRequired: boolean;
}

export function SpecReview({ data, id, onAction, machineStatus }: { data: DataType, id: string, onAction: (action: string) => void, machineStatus: MachineStatus }) {
  const file = data.file;
  const isPrev = id.includes('|prev-');

  const { content } = useContentFromLocalFile(file);
  const openFile = () => {
    // TODO send postMessage to extension to open file
    postMessage({
      type: 'openFile',
      file,
    });
  }

  const approveSpec = () => {
    onAction('approveSpec');
  }

  const rejectSpec = () => {
    onAction('rejectSpec');
  }

  useEffect(() => {
    if (machineStatus === 'running') {
      return;
    }

    openFile();
  }, []);

  const message = `I’ve generated a **design specification**.
You can **review it directly in the generated file**, modify and save it.

> Keep in mind: I will use **this same file** to generate the **next state**.

---
${content}
`
  return (
    <div className="design-spec-review">
      {content && <GeneralMessageBubble content={message} topActions={(
        <div className="text-button" onClick={openFile}>Open file <FileSymlink className="file-icon" /></div>
      )} bottomActions={(
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          {machineStatus === 'awaiting_human' && (
            <div  style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={approveSpec}>Approve</button>
            <button className="btn" onClick={rejectSpec}>Reject</button>
          </div>
          )}
        <div className="text-button" onClick={openFile}>Open file <FileSymlink className="file-icon" /></div>
          </div>
      )} />}
    </div>
  );
}
