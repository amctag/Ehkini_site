export default function GiftCard({ gift, onClick }) {
  return (
    <button type="button" className="gift-card gift-card-button" onClick={() => onClick(gift)}>
      <div className="gift-icon" aria-hidden="true">
        {gift.icon}
      </div>
      <h3>{gift.name}</h3>
      <p>{gift.description}</p>
    </button>
  );
}
