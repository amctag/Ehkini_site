import { CreditCard, DollarSign, Gift, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import DashboardShell from "./DashboardShell";

const walletActions = [
  { icon: CreditCard, title: "Payment Methods", subtitle: "Manage cards", tone: "blue" },
  { icon: Gift, title: "Referral Bonus", subtitle: "Earn $5", tone: "green" },
  { icon: null, title: "VIP Membership", subtitle: "Go premium", tone: "purple", emoji: "👑" }
];

const transactions = [
  { type: "up", title: "Received Diamond from Maya", date: "2024-11-06", amount: "+$10" },
  { type: "down", title: "Sent Ring to Sarah", date: "2024-11-06", amount: "-$5" },
  { type: "plus", title: "Initial bonus", date: "2024-11-05", amount: "+$20" },
  { type: "up", title: "Received Crown from Omar", date: "2024-11-04", amount: "+$8" },
  { type: "down", title: "Sent Rose to Ahmed", date: "2024-11-04", amount: "-$2" }
];

function TransactionIcon({ type }) {
  if (type === "down") {
    return (
      <span className="transaction-icon down">
        <TrendingDown size={20} />
      </span>
    );
  }

  if (type === "plus") {
    return (
      <span className="transaction-icon plus">
        <Plus size={20} />
      </span>
    );
  }

  return (
    <span className="transaction-icon up">
      <TrendingUp size={20} />
    </span>
  );
}

export default function WalletPage() {
  return (
    <DashboardShell activePage="Wallet" title="Wallet" subtitle="Manage your earnings and points">
      <section className="wallet-page">
        <article className="wallet-hero">
          <div className="wallet-hero-head">
            <div>
              <p>Total Balance</p>
              <h2>
                $20 <span>Active</span>
              </h2>
            </div>
            <span className="wallet-hero-icon">
              <Wallet size={38} />
            </span>
          </div>

          <div className="wallet-summary-grid">
            <div>
              <TrendingUp size={17} />
              <span>Earned</span>
              <strong>$18</strong>
            </div>
            <div>
              <TrendingDown size={17} />
              <span>Spent</span>
              <strong>$7</strong>
            </div>
          </div>

          <div className="wallet-hero-actions">
            <button className="wallet-add-points" type="button">
              <Plus size={17} />
              Add Points
            </button>
            <button className="wallet-withdraw" type="button">
              <DollarSign size={17} />
              Withdraw
            </button>
          </div>
          <p className="wallet-minimum">Minimum $50 required to withdraw</p>
        </article>

        <div className="wallet-action-grid">
          {walletActions.map(({ icon: Icon, title, subtitle, tone, emoji }) => (
            <article className="wallet-action-card" key={title}>
              <span className={tone}>{Icon ? <Icon size={24} /> : emoji}</span>
              <div>
                <h3>{title}</h3>
                <p>{subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="transaction-panel">
          <h2>Transaction History</h2>
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div className="transaction-row" key={`${transaction.title}-${transaction.date}`}>
                <TransactionIcon type={transaction.type} />
                <div>
                  <h3>{transaction.title}</h3>
                  <p>{transaction.date}</p>
                </div>
                <strong className={transaction.amount.startsWith("+") ? "positive" : "negative"}>
                  {transaction.amount}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
