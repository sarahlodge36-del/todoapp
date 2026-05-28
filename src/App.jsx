import { useState, useEffect } from "react"

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos")
    return saved ? JSON.parse(saved) : [
      { text: "Buy groceries", done: false, priority: "medium", dueDate: "" },
      { text: "Learn React", done: false, priority: "high", dueDate: "" }
    ]
  })
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [editIndex, setEditIndex] = useState(null)
  const [editText, setEditText] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    if (input.trim() === "") return
    setTodos([...todos, { text: input, done: false, priority, dueDate }])
    setInput("")
    setDueDate("")
  }

  function removeTodo(index) {
    setTodos(todos.filter((_, i) => i !== index))
  }

  function toggleTodo(index) {
    setTodos(todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
    ))
  }

  function startEdit(index) {
    setEditIndex(index)
    setEditText(todos[index].text)
  }

  function saveEdit(index) {
    if (editText.trim() === "") return
    setTodos(todos.map((todo, i) =>
      i === index ? { ...todo, text: editText } : todo
    ))
    setEditIndex(null)
    setEditText("")
  }

  function clearCompleted() {
    setTodos(todos.filter(todo => !todo.done))
  }

  function priorityColor(p) {
    if (p === "high") return "#ff4757"
    if (p === "medium") return "#ffa502"
    return "#2ed573"
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false
    return new Date(dateStr) < new Date(new Date().toDateString())
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addTodo()
  }

  const highCount = todos.filter(t => t.priority === "high" && !t.done).length
  const doneCount = todos.filter(t => t.done).length

  const filteredTodos = todos.filter(todo => {
    if (filter === "all") return true
    if (filter === "done") return todo.done
    if (filter === "active") return !todo.done
    return todo.priority === filter
  })

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f5a7e1,#a7c5f5,#a7f5c5)",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:"40px"}}>
      <div style={{background:"white",borderRadius:"20px",padding:"40px",width:"100%",maxWidth:"500px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}}>
        <h1 style={{color:"#ff6b9d",textAlign:"center",marginBottom:"5px"}}>
          My Todo List 🌈
          {highCount > 0 && <span style={{background:"#ff4757",color:"white",borderRadius:"50%",padding:"2px 8px",fontSize:"14px",marginLeft:"10px"}}>{highCount} urgent</span>}
        </h1>
        <p style={{textAlign:"center",color:"#888",marginBottom:"20px"}}>{todos.filter(t => !t.done).length} tasks remaining</p>

        <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
          {["all","active","done","high","medium","low"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{padding:"6px 14px",borderRadius:"20px",border:"2px solid #f5a7e1",background:filter===f?"#ff6b9d":"white",color:filter===f?"white":"#ff6b9d",cursor:"pointer",fontSize:"13px",fontWeight:"bold"}}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:"10px",marginBottom:"10px"}}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add a new todo..." style={{flex:1,padding:"10px 15px",borderRadius:"10px",border:"2px solid #f5a7e1",fontSize:"16px",outline:"none"}}/>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{padding:"10px",borderRadius:"10px",border:"2px solid #f5a7e1",fontSize:"14px",outline:"none",cursor:"pointer"}}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
        <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{flex:1,padding:"10px 15px",borderRadius:"10px",border:"2px solid #f5a7e1",fontSize:"16px",outline:"none"}}/>
          <button onClick={addTodo} style={{background:"#ff6b9d",color:"white",border:"none",borderRadius:"10px",padding:"10px 20px",fontSize:"16px",cursor:"pointer"}}>Add</button>
        </div>

        <ul style={{listStyle:"none",padding:0}}>
          {filteredTodos.map((todo, index) => {
            const realIndex = todos.indexOf(todo)
            return (
              <li key={realIndex} style={{background:todo.done?"#f0f0f0":"#fff9fe",border:"2px solid #f5a7e1",borderRadius:"10px",padding:"12px 15px",marginBottom:"10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",flex:1}}>
                    <span style={{background:priorityColor(todo.priority),color:"white",borderRadius:"6px",padding:"2px 8px",fontSize:"12px",fontWeight:"bold"}}>{todo.priority.toUpperCase()}</span>
                    {editIndex === realIndex
                      ? <input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit(realIndex)} style={{flex:1,padding:"4px 8px",borderRadius:"6px",border:"2px solid #ff6b9d",fontSize:"16px",outline:"none"}} autoFocus/>
                      : <span onClick={() => toggleTodo(realIndex)} style={{textDecoration:todo.done?"line-through":"none",color:todo.done?"#aaa":"#333",cursor:"pointer",fontSize:"16px"}}>{todo.done?"✅ ":"⭕ "}{todo.text}</span>
                    }
                  </div>
                  <div style={{display:"flex",gap:"6px",marginLeft:"10px"}}>
                    {editIndex === realIndex
                      ? <button onClick={() => saveEdit(realIndex)} style={{background:"#2ed573",color:"white",border:"none",borderRadius:"8px",padding:"5px 10px",cursor:"pointer"}}>✓</button>
                      : <button onClick={() => startEdit(realIndex)} style={{background:"#ffa502",color:"white",border:"none",borderRadius:"8px",padding:"5px 10px",cursor:"pointer"}}>✎</button>
                    }
                    <button onClick={() => removeTodo(realIndex)} style={{background:"#ff6b9d",color:"white",border:"none",borderRadius:"8px",padding:"5px 10px",cursor:"pointer"}}>✕</button>
                  </div>
                </div>
                {todo.dueDate && (
                  <p style={{margin:"6px 0 0 0",fontSize:"12px",color:isOverdue(todo.dueDate)&&!todo.done?"#ff4757":"#888"}}>
                    📅 Due: {new Date(todo.dueDate).toLocaleDateString("en-GB")} {isOverdue(todo.dueDate)&&!todo.done?"⚠️ Overdue!":""}
                  </p>
                )}
              </li>
            )
          })}
        </ul>

        {doneCount > 0 && (
          <button onClick={clearCompleted} style={{width:"100%",padding:"10px",background:"white",color:"#ff6b9d",border:"2px solid #f5a7e1",borderRadius:"10px",fontSize:"14px",cursor:"pointer",marginTop:"10px"}}>
            🗑️ Clear {doneCount} completed {doneCount === 1 ? "task" : "tasks"}
          </button>
        )}
      </div>
    </div>
  )
}

export default App