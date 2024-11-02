Modal.jsx
import "./Modal.css";

export function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="modal-background" onClick={onClose}>
      <section className="modal-main" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="close" type="button" onClick={onClose}>
          &#x2715;
        </button>
      </section>
    </div>
  );
}




// Original way:

// import "./Modal.css";

// export function Modal(props) {
//   if (props.show) {
//     return (
//       <div className="modal-background">
//         <section className="modal-main">
//           {props.children}
//           <button className="close" type="button" onClick={props.onClose}>
//             &#x2715;
//           </button>
//         </section>
//       </div>
//     );
//   }
// }