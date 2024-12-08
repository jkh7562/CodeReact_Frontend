import { useEffect, useRef, useState } from "react";
import { deleteOne, getOne, putOne } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ResultModal from "../common/ResultModal";

const initState = {
    pno:0,
    pname: '',
    pdesc: '',
    price: 0,
    delFlag:false,
    uploadFileNames:[]
}

const host = API_SERVER_HOST

const ModifyComponent = ({pno}) => {

    const {moveToList, moveToRead} = useCustomMove()
    const [product, setProduct] = useState(initState)

    const uploadRef = useRef()

    const query = useQuery(
        ['products', pno],
        () => getOne(pno),
        {
            staleTime: Infinity
        }
    )

    useEffect(() => {

        if(query.isSuccess){
            setProduct(query.data)
        }

    },[pno, query.data, query.isSuccess])


    const handleChangeProduct = (e) => {

        product[e.target.name] = e.target.value

        setProduct({...product})
    }

    const deleteOldImages = (imageName) => {

        const resultFileNames = product.uploadFileNames.filter( fileName => fileName !== imageName)

        product.uploadFileNames = resultFileNames

        setProduct({...product})
    }

    const delMutation = useMutation((pno) => deleteOne(pno))

    const queryClient = useQueryClient()

    const handleClickDelete = () => {

        delMutation.mutate(pno)

    }

    const modMutation = useMutation((product) => putOne(pno, product))

    const handleClickModify = () => {

        const files = uploadRef.current.files

        const formData = new FormData()

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        //other data
        formData.append("pname", product.pname)
        formData.append("pdesc", product.pdesc)
        formData.append("price", product.price)
        formData.append("delFlag", product.delFlag)

        for( let i = 0; i < product.uploadFileNames.length ; i++){
            formData.append("uploadFileNames", product.uploadFileNames[i])
        }

        modMutation.mutate(formData)

    }


    const closeModal = () => {

        if(delMutation.isSuccess) {
            queryClient.invalidateQueries(['products', pno])
            queryClient.invalidateQueries(['products/list'])
            moveToList()
            return
        }

        if(modMutation.isSuccess) {
            queryClient.invalidateQueries(['products', pno])
            queryClient.invalidateQueries(['products/list'])
            moveToRead(pno)
        }

    }



    return (
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4">


            {query.isFetching || delMutation.isLoading || modMutation.isLoading ?
                <FetchingModal/>
                :
                <></>
            }

            {
                delMutation.isSuccess || modMutation.isSuccess ?
                    <ResultModal
                        title={'처리 결과'}
                        content={'정상적으로 처리되었습니다.'}
                        callbackFn={closeModal}>

                    </ResultModal>
                    :
                    <></>
            }




            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Product Name</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                           name="pname"
                           type={'text'}
                           value={product.pname}
                           onChange={handleChangeProduct}
                    >
                    </input>

                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Desc</div>
                    <textarea
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
                        name="pdesc"
                        rows="4"
                        onChange={handleChangeProduct}
                        value={product.pdesc}>
            {product.pdesc}
          </textarea>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Price</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                           name="price"
                           type={'number'}
                           value={product.price}
                           onChange={handleChangeProduct}
                    >
                    </input>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">DELETE</div>
                    <select
                        name="delFlag" value={product.delFlag}
                        onChange={handleChangeProduct}
                        className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md">
                        <option value={false}>사용</option>
                        <option value={true}>삭제</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">Files</div>
                    <input ref={uploadRef}
                           className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                           type={'file'} multiple={true}
                    >
                    </input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">
                        Images
                    </div>
                    <div className="w-4/5 justify-center flex flex-wrap items-start">

                        {product.uploadFileNames.map( (imgFile, i) =>
                            <div
                                className="flex justify-center flex-col w-1/3"
                                key = {i}>
                                <button className="bg-blue-500 text-3xl text-white"
                                        onClick={() => deleteOldImages(imgFile)}
                                >DELETE</button>
                                <img
                                    alt ="img"
                                    src={`${host}/api/products/view/s_${imgFile}`}/>

                            </div>
                        )}


                    </div>
                </div>
            </div>

            <div className="flex justify-end p-4">
                <button type="button"
                        className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
                        onClick={handleClickDelete}
                >
                    Delete
                </button>

                <button type="button"
                        className="inline-block rounded p-4 m-2 text-xl w-32  text-white bg-orange-500"
                        onClick={handleClickModify}
                >
                    Modify
                </button>

                <button type="button"
                        className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
                        onClick={moveToList}
                >
                    List
                </button>

            </div>

        </div>
    );
}

export default ModifyComponent;