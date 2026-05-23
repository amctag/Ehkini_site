import Image from "next/image";

export default function GiftCard({ gift, onClick }) {
  const iconText = String(gift?.icon ?? "").trim();
  const iconIsImage = iconText.startsWith("http") || iconText.startsWith("/");

  return (
    <button type="button" className="gift-card gift-card-button" onClick={() => onClick(gift)}>
      <div className="gift-icon" aria-hidden="true">
        {iconIsImage ? (
          <Image src={iconText} alt="" width={44} height={44} unoptimized />
        ) : iconText}
      </div>
      <h3>{gift.name}</h3>
      <p>{gift.description}</p>
    </button>
  );
}
