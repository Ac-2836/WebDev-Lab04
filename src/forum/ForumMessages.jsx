import { Fragment, useId, useState } from 'react';
import { useParams } from 'react-router';
import { useForumMessages } from './useForumMessages.js';
import styles from './Forum.module.css';

const EMPTY_DRAFT = { author: '', text: '' };

// Same rule as the server: both fields are required and not blank.
export function validateMessage({ author, text }) {
  const errors = {};
  if (!author.trim()) errors.author = 'Author is required.';
  if (!text.trim()) errors.text = 'Message is required.';
  return errors;
}

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export function ForumMessages() {
  const { forumId } = useParams();
  const { data, status, loading, error, postMessage } =
    useForumMessages(forumId);

  return (
    <section
      className={styles.messages}
      aria-labelledby='channel-heading'
      aria-busy={loading}
    >
      <h3 id='channel-heading' className={styles.channelHeading}>
        #{forumId}
      </h3>
      <output className={styles.status} aria-live='polite'>
        {status === 'LOADING' && 'Loading messages...'}
        {status === 'SUCCESS' && `${data.length} message(s)`}
      </output>
      {status === 'ERROR' && (
        <p className={styles.error} role='alert'>
          Could not load #{forumId}: {error}
        </p>
      )}
      {data.length > 0 && (
        <dl className={styles.messageList}>
          {data.map((msg) => (
            <Fragment key={msg.id}>
              <dt>
                <strong>{msg.author}</strong>{' '}
                <time dateTime={msg.timestamp}>
                  {formatTime(msg.timestamp)}
                </time>
              </dt>
              <dd>{msg.text}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      {status !== 'ERROR' && (
        <MessageForm key={forumId} onPost={postMessage} />
      )}
    </section>
  );
}

function MessageForm({ onPost }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [sendState, setSendState] = useState({ status: 'IDLE', error: null });
  const authorId = useId();
  const textId = useId();
  const errors = validateMessage(draft);
  const shown = submitAttempted ? errors : {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const [firstInvalid] = Object.keys(errors);
    if (firstInvalid) {
      e.currentTarget.elements.namedItem(firstInvalid).focus();
      return;
    }
    setSendState({ status: 'SENDING', error: null });
    try {
      await onPost(draft);
      setDraft((prev) => ({ ...prev, text: '' }));
      setSubmitAttempted(false);
      setSendState({ status: 'IDLE', error: null });
    } catch (err) {
      setSendState({ status: 'ERROR', error: err.message });
    }
  };

  const sending = sendState.status === 'SENDING';

  return (
    <form
      className={styles.postForm}
      aria-label='Post a message'
      noValidate
      onSubmit={handleSubmit}
    >
      <p className={styles.field}>
        <label htmlFor={authorId}>Author</label>
        <input
          id={authorId}
          name='author'
          autoComplete='nickname'
          value={draft.author}
          aria-invalid={Boolean(shown.author)}
          aria-describedby={shown.author ? `${authorId}-error` : undefined}
          onChange={handleChange}
        />
        {shown.author && (
          <span id={`${authorId}-error`} className={styles.error} role='alert'>
            {shown.author}
          </span>
        )}
      </p>
      <p className={styles.field}>
        <label htmlFor={textId}>Message</label>
        <textarea
          id={textId}
          name='text'
          rows={3}
          value={draft.text}
          aria-invalid={Boolean(shown.text)}
          aria-describedby={shown.text ? `${textId}-error` : undefined}
          onChange={handleChange}
        />
        {shown.text && (
          <span id={`${textId}-error`} className={styles.error} role='alert'>
            {shown.text}
          </span>
        )}
      </p>
      {sendState.status === 'ERROR' && (
        <p className={styles.error} role='alert'>
          Message not sent: {sendState.error}
        </p>
      )}
      <button
        type='submit'
        className={styles.send}
        disabled={sending}
        aria-busy={sending}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
