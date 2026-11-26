import { computeMatrix } from './compute-matrix.js';
import styles from './AppealTribunal.module.css';

export function DisproportionalityMatrix({ dossier }) {
  // Derived during render; no useMemo until profiling asks for it.
  const { rows, total } = computeMatrix(dossier);

  return (
    // tabIndex: keyboard users can scroll the table when it overflows.
    <section
      className={styles.matrixWrap}
      aria-labelledby='matrix-caption'
      tabIndex={0}
    >
      <table className={styles.matrix}>
        <caption id='matrix-caption'>
          Disproportionality matrix: ban compared with precedent
        </caption>
        <thead>
          <tr>
            <th scope='col'>Charge</th>
            <th scope='col'>Severity (1-5)</th>
            <th scope='col'>Ban (days)</th>
            <th scope='col'>Precedent (days)</th>
            <th scope='col'>Ratio</th>
            <th scope='col'>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <th scope='row'>
                {r.code}: {r.offence}
              </th>
              <td>{r.severity}</td>
              <td>{r.banDays}</td>
              <td>{r.precedentDays}</td>
              <td>{r.ratio.toFixed(2)}x</td>
              <td data-verdict={r.verdict}>{r.verdict}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope='row'>Whole case</th>
            <td>-</td>
            <td>{total.banDays}</td>
            <td>{total.precedentDays}</td>
            <td>{total.ratio.toFixed(2)}x</td>
            <td data-verdict={total.verdict}>{total.verdict}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
