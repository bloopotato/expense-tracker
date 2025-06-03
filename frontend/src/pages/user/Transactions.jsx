import {deleteTransaction, retrieveTransactionsByDate} from "../../services/TransactionService.js";
import TransactionCard from "../../components/cards/TransactionCard.jsx";
import { FaPlus } from "react-icons/fa";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import CreateTransaction from "./create/CreateTransaction.jsx";
import Loading from "../../components/Loading.jsx";
import MonthSlider from "../../components/MonthSlider.jsx";
import { useEffect, useMemo, useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import EditCategory from "./edit/EditCategory.jsx";
import EditTransaction from "./edit/EditTransaction.jsx";

export default function Transactions() {
    const [loading, setLoading] = useState(true);
    const [transactionData, setTransactionData] = useState({});
    const [showTransaction, setShowTransaction] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [deleteInfo, setDeleteInfo] = useState({
        delete: false,
        id: '',
        name: '',
    });

    function parseDateAsLocal(dateStr) {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day); // local time
    }

    // Retrieve Data
    const refresh = async () => {
        try {
            const data = await retrieveTransactionsByDate(); // now returns { "2025-05": { "2025-05-30": [...] } }
            setTransactionData(data);
            setSelectedTransaction(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh when loaded and token available
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            void refresh();
        } else {
            setLoading(false);
        }
    }, []);

    // Recalculate when loaded
    useEffect(() => {
        if (!selectedMonth && transactionData && Object.keys(transactionData).length > 0) {
            const firstMonth = Object.keys(transactionData).sort()[0];
            const [year, month] = firstMonth.split("-");
            setSelectedMonth(new Date(parseInt(year), parseInt(month) - 1));
        }
    }, [transactionData]);

    function formatCurrency(amount) {
        const absAmount = Math.abs(amount).toFixed(2);
        return amount < 0 ? `-$${absAmount}` : `$${absAmount}`;
    }

    function formatMonthKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    // Month range for MonthSlider
    const [minMonth, maxMonth] = useMemo(() => {
        const monthKeys = Object.keys(transactionData).sort();
        if (monthKeys.length === 0) return [null, null];
        // 1. Get earliest transaction month
        const [firstYear, firstMonth] = monthKeys[0].split("-");
        const earliest = new Date(parseInt(firstYear), parseInt(firstMonth) - 1);

        // 2. Get one year before today
        const oneYearBefore = new Date(earliest);
        oneYearBefore.setFullYear(earliest.getFullYear());
        oneYearBefore.setDate(1);

        // 3. Get earlier of both dates
        const minDate = oneYearBefore < earliest ? oneYearBefore : earliest;

        // 4. Set max date as 1 year from today
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        maxDate.setDate(1);

        const toMonthString = (d) => d.toISOString().slice(0, 7);
        return [toMonthString(minDate), toMonthString(maxDate)];
    }, [transactionData]);

    // Filter data based on selectedMonth
    const selectedMonthKey = selectedMonth ? formatMonthKey(selectedMonth) : null;
    const filteredEntries = selectedMonthKey && transactionData[selectedMonthKey]
        ? Object.entries(transactionData[selectedMonthKey])
        : [];

    const monthlyTotals = filteredEntries.reduce(
        (totals, [_, transactions]) => {
            for (const tx of transactions) {
                if (tx.type === "INCOME") {
                    totals.income += tx.amount;
                } else if (tx.type === "EXPENSE") {
                    totals.expense += tx.amount;
                }
            }
            return totals;
        },
        { income: 0, expense: 0 }
    );

    const monthlyFinal = monthlyTotals.income - monthlyTotals.expense;

    const handleClose = () => {
        setShowTransaction(false);
    };

    const handleSubmit = async () => {
        await refresh();
        setShowTransaction(false);
    };

    const handleSave = async () => {
        await refresh();
        setSelectedTransaction(null);
    }

    // Cancel Delete
    const handleHideDelete = () => {
        setDeleteInfo({ delete: false, id: '', name: ''});
    }

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            await refresh();
            handleHideDelete()
        } catch (error) {
            console.log(error);
        }
    }

    const now = new Date();
    if (loading) return <Loading />;
    return (
        <div className="flex flex-col pt-[3rem] h-screen">
            <h1 className="text-[4rem]">Transactions</h1>

            {/* Month Selector */}
            <div className="flex-shrink-0">
                <MonthSlider
                    minDate={minMonth ? new Date(minMonth) : new Date(now.getFullYear(), now.getMonth() - 6)}
                    maxDate={maxMonth ? new Date(maxMonth) : new Date(now.getFullYear(), now.getMonth() + 6)}
                    onChange={setSelectedMonth}
                />
            </div>

            {/* Summary  */}
            <div className="flex bg-tertiary w-[50rem] self-center justify-between py-[0.5rem] px-[2rem] rounded-[1rem]">
                <p className="flex text-red items-center">
                    <GoTriangleDown/>
                    ${monthlyTotals.expense.toFixed(2)}
                </p>
                <p className="flex text-green items-center">
                    <GoTriangleUp/>
                    ${monthlyTotals.income.toFixed(2)}
                </p>
                <p>={` `}
                    <span className={monthlyFinal >= 0 ? "text-[#38B000]" : "text-[#D7263D]"}>
                        {formatCurrency(monthlyFinal)}
                    </span>
                </p>
            </div>

            {/* Transaction Entries */}
            <div className="flex overflow-y-scroll scrollbar-custom justify-center">
                <div>
                    {filteredEntries.length === 0 && (
                        <p className="text-secondary">No transactions for this month.</p>
                    )}
                    {filteredEntries.map(([date, transactions]) => {
                        const income = transactions
                            .filter((tx) => tx.type === "INCOME")
                            .reduce((sum, tx) => sum + tx.amount, 0)
                            .toFixed(2);
                        const expense = transactions
                            .filter((tx) => tx.type === "EXPENSE")
                            .reduce((sum, tx) => sum + tx.amount, 0)
                            .toFixed(2);
                        const dayTotal = (parseFloat(income) - parseFloat(expense)).toFixed(2);

                        const formatDate = parseDateAsLocal(date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }).replace(",", ""); // remove comma after weekday

                        return (
                            <div key={date} className="p-[1rem] w-[50rem]">
                                <div className="flex items-center justify-between text-secondary">
                                    <h2 className="font-semibold">{formatDate}</h2>
                                    <p>{formatCurrency(dayTotal)}</p>
                                </div>
                                <div className="flex flex-col gap-[0.5rem] w-full">
                                    <AnimatePresence mode="sync">
                                    {transactions.map((tx) => (
                                        selectedTransaction?.id === tx.id ? (
                                                <motion.div
                                                    key={`edit-${tx.id}`}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <EditTransaction
                                                        transaction={tx}
                                                        onClose={() => setSelectedTransaction(null)}
                                                        onSave={handleSave}
                                                        onDelete={() => {setDeleteInfo({delete: true, id: tx.id, name: tx.title});}}
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key={`card-${tx.id}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <TransactionCard
                                                        key={tx.id}
                                                        title={tx.title}
                                                        category={tx.categoryName}
                                                        colour={tx.colour}
                                                        amount={tx.amount.toFixed(2)}
                                                        type={tx.type}
                                                        onClick={() => {
                                                            console.log("Clicked transaction:", tx);
                                                            setSelectedTransaction(tx)
                                                        }}
                                                    />
                                                </motion.div>
                                            )
                                    ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Transaction */}
            <button
                onClick={() => setShowTransaction(true)}
                className="fixed bottom-10 right-10 p-[2rem] bg-foreground text-background text-[2rem] rounded-[2rem]"
            >
                <FaPlus />
            </button>

            {/* Create Transaction Modal */}
            {showTransaction && (
                <div className="flex flex-1 absolute inset-0 z-50 items-center justify-center bg-background">
                    <CreateTransaction onClose={handleClose} onSubmit={handleSubmit} />
                </div>
            )}

            {/* Show Delete Popup */}
            {deleteInfo.delete && (
                <div className="absolute flex inset-0 z-50 justify-center items-center">
                    <div className="bg-black opacity-50 w-full h-full"></div>
                    <div className="absolute bg-background p-[5rem] rounded-[2rem] w-[50rem] flex flex-col gap-[2rem]">
                        <h1 className="text-[2.8rem]">Delete transaction "{deleteInfo.name}"?</h1>
                        <div className="flex justify-between px-[2rem]">
                            <button
                                onClick={handleHideDelete}
                                className="bg-secondary text-background w-[10rem] justify-center rounded-[1rem] px-[1rem] py-[1rem]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete.bind(this, deleteInfo.id)}
                                className="bg-red text-background w-[10rem] justify-center rounded-[1rem] px-[1rem] py-[1rem]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
