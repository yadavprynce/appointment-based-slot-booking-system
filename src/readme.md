--Learning from this projects

Something just clicked my mind if i have already attached role to the payload while siging it then why i even need a role checker middleware ? i can simply put a if statement and check if req.user.role ==="USER" or  req.user.role ==="SERVICE_PROVIDER"

if(req.user?.role === "SERVICE_PROVIDER"){
    return res.status(403).json({ message: "Forbidden" })
}

If you have multiple routes that need the same role check...then probably need a middleware 

The best is to create a higher order function whic give a fuction(our middleware)




2.Validating slot id which looks like "slotId":"uuid_2026-02-06_09:00"

i know how do i validaye date and time but not uuid its very long so for that we can use .+ which means it matches anything

the whole is  - regex(\^.+_/d{4}-/d{2}-/d{2}_/d{2}:/d{2}$\)