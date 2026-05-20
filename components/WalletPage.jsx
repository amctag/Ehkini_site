import { CreditCard, DollarSign, Gift, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import DashboardShell from "./DashboardShell";

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

function WalletActionIcon({ action }) {
  if (action.icon === "card") return <CreditCard size={24} />;
  if (action.icon === "gift") return <Gift size={24} />;
  return action.emoji;
}

export default function WalletPage() {
  const t = useTranslations("wallet");
  const walletActions = t.raw("walletActions");
  const transactions = t.raw("transactions");

  return (
    <DashboardShell activePageKey="wallet" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="wallet-page">
        <article className="wallet-hero">
          <div className="wallet-hero-head">
            <div>
              <p>{t("totalBalance")}</p>
              <h2>
                $20 <span>{t("active")}</span>
              </h2>
            </div>
            <span className="wallet-hero-icon">
              <Wallet size={38} />
            </span>
          </div>

          <div className="wallet-summary-grid">
            <div>
              <TrendingUp size={17} />
              <span>{t("earned")}</span>
              <strong>$18</strong>
            </div>
            <div>
              <TrendingDown size={17} />
              <span>{t("spent")}</span>
              <strong>$7</strong>
            </div>
          </div>

          <div className="wallet-hero-actions">
            <button className="wallet-add-points" type="button">
              <Plus size={17} />
              {t("addPoints")}
            </button>
            <button className="wallet-withdraw" type="button">
              <DollarSign size={17} />
              {t("withdraw")}
            </button>
          </div>
          <p className="wallet-minimum">{t("minimumWithdraw")}</p>
        </article>

        <div className="wallet-action-grid">
          {walletActions.map((action) => (
            <article className="wallet-action-card" key={action.title}>
              <span className={action.tone}>
                <WalletActionIcon action={action} />
              </span>
              <div>
                <h3>{action.title}</h3>
                <p>{action.subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="transaction-panel">
          <h2>{t("transactionHistory")}</h2>
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
