import {retrieveCategories} from "../../services/CategoryService.js";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

export default function CategoryPicker({ input, setInput, setError, textSize = "text-[2rem]" }) {
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState([]);
    const [showList, setShowList] = useState(false);
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = await retrieveCategories();
                const sortedData = data.sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                setCategoryData(sortedData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const filteredData = categoryData.filter((category) => category.type === input.type);

    if (loading) return <div>Loading...</div>;
    return (
        <div className="flex flex-col gap-[2rem]">
            <button
                onClick={() => setShowList(prev => !prev)}
                className={`flex bg-foreground py-[1rem] text-background px-[2rem] rounded-[2rem] w-full gap-[1rem] items-center
                    ${textSize}
                `}
                style={{ background: input.colour }}
            >
                <h1>Category:</h1>
                {input.categoryName ? (<p>{input.categoryName}</p>) : (<p className="text-primary">(Select Category)</p>)}
            </button>

            <AnimatePresence>
                {showList && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: 'auto' }}
                        exit={{ opacity: 0, scale: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-wrap gap-x-[3rem] gap-y-[2rem] justify-center"
                    >
                        {filteredData.length > 0 ? (
                            filteredData.map((category) => (
                                <button
                                    key={category.id}
                                    className="text-background py-[1rem] px-[2rem] w-[15rem] rounded-[2rem]"
                                    style={{ backgroundColor: category.colour }}
                                    onClick={() => {
                                        setInput(prev => ({
                                            ...prev,
                                            categoryName: category.name,
                                            colour: category.colour,
                                        }));
                                        setError(prev => ({
                                            ...prev,
                                            categoryName: '',
                                        }));
                                        setShowList(false);
                                    }}
                                >
                                    {category.name}
                                </button>
                            ))
                        ) : (
                            <div>No Categories Found</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}