import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faUserPen, faMagnifyingGlass, faAnglesLeft, faAngleLeft, faAnglesRight, faAngleRight, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';


const Body = () => {
    const [mainData,setMainData]=useState([]);
    const [userData, setUserData] = useState([]);
    const [searchText,setSearchText]=useState("");
    const [editRow,setEditRow]=useState(null);
    const [change,setChange]=useState(null);
    const [checkedRow,setCheckedRow]=useState([]);
    const [page, setPage] = useState(1);

    const handleEdit = (selectedUser) => {
        setEditRow(selectedUser);
        setChange({...selectedUser});
    }
    const handleDelete=(id) => {
        setUserData(userData.filter((user)=>user.id !== id));
        setEditRow(null);
    }
    const handleSave=()=>{
        if(editRow){
            setUserData((newdata)=>newdata.map((data)=>data.id === editRow.id ? change : data));
        }
        setEditRow(null);
    }
    
    
    const handlePage = (selectedPage) => {
        if (selectedPage >= 1 && selectedPage <= Math.ceil(userData.length / 10) && selectedPage !== page) {
            setPage(selectedPage);
        }
    }

    const handleCheckedRow=(id)=>{
        setCheckedRow((data)=>data.includes(id)?data.filter((rowId)=>rowId!==id):[...data,id]);
    }
    const handleCheckedDelete = () => {
        setUserData((userdata)=>userdata.filter((data)=>!checkedRow.includes(data.id)));
        setCheckedRow([]);
    }
    const handleSelectAll=()=>{
        const selected=userData.slice(page*10-10,page*10);
        const current=selected.map((row)=>row.id);
        setCheckedRow((userdata)=>userdata.length===selected.length?[]:current);  
    }
    const handleText=(e)=>{
        setSearchText(e.target.value);
    }
    const handleSearch=()=>{
        const filterData=mainData.filter((user)=>Object.values(user).some((value)=>String(value).includes(searchText.toLowerCase())));
        setUserData(filterData);

    }
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const data = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
                if (data.ok) {
                    const res = await data.json();
                    setUserData(res);
                    setMainData(res);
                }
                else console.log("Data not found");
            } catch (error) {
                console.error("Data not fount", error);
            }
        }
        fetchdata();
    }, []);
    return (
        <div>
            <div className="my-2 flex justify-between">
                <div>
                    <input className="border border-gray-300 mr-2 rounded-lg px-2" type="text" placeholder="Enter Value..." value={searchText} onChange={handleText} />
                    <button className="bg-gray-600 rounded-lg px-2 text-white" onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1" />
                        Search
                    </button >
                </div>
                <div>
                    <button className="bg-pink-500 px-2" onClick={handleCheckedDelete}>
                        <FontAwesomeIcon icon={faTrashCan} className=" text-white" />
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border border-gray-30">
                    <thead className="">
                        <tr className="text-lg border-b ">
                            <th className="w-20 text-left py-2 px-2">
                                <input type="checkbox" checked={checkedRow.length===userData.slice(page*10-10,page*10).length} onChange={handleSelectAll} />
                            </th>
                            <th className="text-left py-2 px-2">Name</th>
                            <th className="text-left py-2 px-2">Email</th>
                            <th className="text-left py-2 px-2">Role</th>
                            <th className="text-left py-2 px-2">Action</th>
                        </tr>
                    </thead>
                    {userData.length > 0 && (<tbody className="">
                        {userData.sort((a, b) => { return a.id - b.id }).slice(page * 10 - 10, page * 10).map((user) => (
                            < tr key={user?.id} className={checkedRow.includes(user.id) ? "bg-gray-300" : "border-b hover:bg-gray-300"}>
                                <td className="text-left py-4 px-2">
                                    <input type="checkbox" checked={Array.isArray(checkedRow) && checkedRow.includes(user.id)} onChange={()=>handleCheckedRow(user.id)}/>
                                </td>
                                <td className="text-left py-4 px-2">{editRow && editRow.id===user.id?(<input type="text" value={change.name} onChange={(e)=>setChange({...change,name:e.target.value})}/>):(user.name)}</td>
                                <td className="text-left py-4 px-2">{editRow && editRow.id===user.id?(<input type="email" value={change.email} onChange={(e)=>setChange({...change,email:e.target.value})}/>):(user.email)}</td>
                                <td className="text-left py-4 px-2">{editRow && editRow.id===user.id?(<input type="text" value={change.role} onChange={(e)=>setChange({...change,role:e.target.value})}/>):(user.role)}</td>
                                <td className="text-left py-4 px-2">
                                    <button className="bg-blue-400 rounded-lg mx-1 px-2" onClick={()=>handleEdit(user)}>
                                        <FontAwesomeIcon icon={faUserPen} className="mr-1" />
                                        Edit</button>
                                    <button className="bg-red-400 rounded-lg mx-1 px-2" onClick={()=>handleDelete(user.id)}>
                                        <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
                                        Delete
                                    </button>
                                    <button className="bg-green-400 rounded-lg mx-1 px-2" onClick={handleSave}>
                                    <FontAwesomeIcon icon={faFileArrowUp} className="mr-1"/>
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    )}
                </table>  
            </div >
            {userData.length > 0 &&
                    (<div className="my-2 flex justify-between">
                        <div>
                            <span>{checkedRow.length} of {userData.length} selected</span>
                        </div>
                        <div className="cursor-pointer">
                            <span>Page {page} of {Math.ceil(userData.length / 10)}</span>
                            <span className="bg-gray-300 px-1 mx-1 hover:bg-gray-500" onClick={() => handlePage(1)}><FontAwesomeIcon icon={faAnglesLeft} /></span>
                            <span className="bg-gray-300 px-1 hover:bg-gray-500" onClick={() => handlePage(page - 1)}><FontAwesomeIcon icon={faAngleLeft} /></span>
                            {[...Array(Math.ceil(userData.length / 10))].map((u, i) => {
                                return (
                                    <span key={i} className="border border-gray-300 px-1 mx-1 hover:bg-gray-300" onClick={() => handlePage(i + 1)}>{i + 1}</span>
                                )
                            })}
                            <span className="bg-gray-300 px-1 mr-1 hover:bg-gray-500" onClick={() => handlePage(page + 1)}><FontAwesomeIcon icon={faAngleRight} /></span>
                            <span className="bg-gray-300 px-1 hover:bg-gray-500" onClick={() => handlePage(Math.ceil(userData.length / 10))}><FontAwesomeIcon icon={faAnglesRight} /></span>
                        </div>
                    </div>)
                }
        </div>
    )
}
export default Body;