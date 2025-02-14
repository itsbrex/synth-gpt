import userEvent from "@testing-library/user-event";
import { Mock, vi } from "vitest";
import { render } from "@testing-library/react";
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from "uuid";

import Attachments from "./Attachments";
import { removeAttachment } from "../chatSlice";

vi.mock("react-redux", () => ({
	useDispatch: vi.fn(),
}));

describe("Attachments", () => {
	const dispatchMock = vi.fn();
	const attachmentId = uuidv4();

	beforeEach(() => {
		(useDispatch as Mock).mockReturnValue(dispatchMock);
	});

  afterEach(() => {
    vi.clearAllMocks();
  });

  const attachments = [
    {
      id: attachmentId,
      type: "File",
      file: {
        name: "hello.txt",
        contentType: "text/plain",
        extension: "txt",
        size: 5,
        contents: "hello",
      }
    } as FileAttachment,
  ];

  it("should render the file attachment with delete button when deletions are allowed", () => {
    const { getByLabelText } = render(
      <Attachments attachments={attachments} allowDeletions={true} />
    );

    const fileAttachment = getByLabelText("hello.txt");
    expect(fileAttachment).toBeInTheDocument();

	const deleteButton = getByLabelText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });

  it("should render the file attachment without delete button when deletions are disallowed", () => {
    const { getByLabelText } = render(
      <Attachments attachments={attachments} allowDeletions={false} />
    );

    const fileAttachment = getByLabelText("hello.txt");
    expect(fileAttachment).toBeInTheDocument();
    expect(fileAttachment.innerHTML).not.toContain("Delete");
  });

  it("should remove the file attachment when deleted", async () => {
    const { getByLabelText } = render(
      <Attachments attachments={attachments} allowDeletions={true} />
    );

    const deleteButton = getByLabelText("Delete");
    userEvent.click(deleteButton);

    expect(dispatchMock).toHaveBeenCalledWith(
		removeAttachment({ attachmentId })
	  );
  });
});
