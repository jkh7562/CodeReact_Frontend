import ListComponent from "../../components/products/ListComponent";


const ListPage = () => {


    return (
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold">
                Products List Page
            </div>

            <ListComponent/>

        </div>
    );
}

export default ListPage;