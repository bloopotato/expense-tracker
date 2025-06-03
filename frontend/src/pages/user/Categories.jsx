import {useEffect, useRef, useState} from "react";
import {createCategory, deleteCategory, editCategory, retrieveCategories} from "../../services/CategoryService.js";
import CategoryCard from "../../components/cards/CategoryCard.jsx";
import CreateCategory from "./create/CreateCategory.jsx";
import {FaPlus, FaSearch} from "react-icons/fa";
import EditCategory from "./edit/EditCategory.jsx";
import {AnimatePresence, motion} from "framer-motion";
import Loading from "../../components/Loading.jsx";

export default function Categories() {
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteInfo, setDeleteInfo] = useState({
        delete: false,
        id: '',
        categoryName: ''
    });

    const refresh = async () => {
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
    };

    // Load when Token is available
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refresh()
        } else {
            setLoading(false);
        }
    }, []);

    // Scroll Logic
    const [isScroll, setIsScroll] = useState(false);
    const scrollRef = useRef(null);
    useEffect(() => {
        const el = scrollRef.current;
        const handleScroll = () => {
            if (el) {setIsScroll(el.scrollTop > 10);}
        }
        if (el) {el.addEventListener('scroll', handleScroll);}
        return () => {if (el) {el.removeEventListener('scroll', handleScroll);}};
    }, [])

    // Search Function
    const [search, setSearch] = useState('');
    const filtered = categoryData.filter((category) => {
        return category.name.toLowerCase().includes(search.toLowerCase())
    });

    // Cancel Delete
    const handleHideDelete = () => {
        setDeleteInfo({ delete: false, id: '', categoryName: ''});
    }

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            await refresh();
            handleHideDelete()
        } catch (error) {
            console.log(error);
        }
    }

    // Handle Save
    const handleSave = async () => {
        try {
            await refresh();
            setSelected(null);
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) return <Loading/>;
    return (
        <div className="h-screen flex flex-col px-[5rem] py-[2rem]">
            {/* Create Button */}
            <button
                onClick={()=> setShowCreate(true)}
                className="fixed bottom-10 right-10 p-[2rem] bg-foreground text-background text-[2rem] rounded-[2rem]"
            >
                <FaPlus/>
            </button>

            {/* Header */}
            <div className="">
                <div className={`rounded-full items-center justify-center flex
                ${isScroll ? "bg-foreground text-background" : "pt-[2rem]"} transition-all duration-300 ease-in-out`}>
                    <h1 className="text-[4rem]">Edit Categories</h1>
                </div>
            </div>

            {/* Category List */}
            <div
                className="flex flex-col flex-1 overflow-y-scroll scrollbar-custom p-[1rem] items-center gap-[2rem]"
                ref={scrollRef}
                onScroll={(e) => {
                    setIsScroll(e.currentTarget.scrollTop > 10);
                }}
            >
                {/* Search Bar */}
                <div className="w-full py-[1rem] px-[4rem] flex justify-start gap-[2rem] bg-tertiary rounded-full">
                    <FaSearch className="text-[2.4rem]"/>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full outline-none"
                        onClick={() => setSelected(null)}
                    />
                </div>
                {filtered.length > 0 ? (
                    <div className="flex flex-col gap-[2rem] items-center justify-center">
                        <AnimatePresence mode="sync">
                            {filtered.map((category) =>
                                selected?.id === category.id ? (
                                    <motion.div
                                        key={`edit-${category.id}`}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <EditCategory
                                            category={category}
                                            onClose={() => setSelected(null)}
                                            onSave={handleSave}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`card-${category.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CategoryCard
                                            name={category.name}
                                            type={category.type}
                                            count={category.count}
                                            colour={category.colour}
                                            onClick={() => setSelected(category)}
                                            onDelete={(e) => {
                                                e.stopPropagation();
                                                setDeleteInfo({
                                                    delete: true,
                                                    id: category.id,
                                                    categoryName: category.name
                                                });
                                            }}
                                        />

                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <p>No categories found</p>
                )}
            </div>

            {showCreate && (
                <div className="flex flex-1 absolute inset-0 z-50 items-center justify-center bg-background">
                    <CreateCategory
                        onClose={() => setShowCreate(false)}
                        refresh={refresh}
                    />
                </div>
            )}
            {/* Show Delete Popup */}
            {deleteInfo.delete && (
                <div className="absolute flex inset-0 z-50 justify-center items-center">
                    <div className="bg-black opacity-50 w-full h-full"></div>
                    <div className="absolute bg-background p-[5rem] rounded-[2rem] w-[50rem] flex flex-col gap-[2rem]">
                        <h1 className="text-[2.8rem]">Delete category "{deleteInfo.categoryName}"?</h1>
                        <p className="text-[1.8rem]">This will delete all transactions associated with this category.</p>
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
    )
}