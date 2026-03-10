--Major Learning from this projects

Something just clicked my mind if i have already attached role to the payload while siging it then why i even need a role checker middleware ? i can simply put a if statement and check if req.user.role ==="USER" or  req.user.role ==="SERVICE_PROVIDER"

if(req.user?.role === "SERVICE_PROVIDER"){
    return res.status(403).json({ message: "Forbidden" })
}

If you have multiple routes that need the same role check...then probably need a middleware 

The best is to create a higher order function whic give a fuction(our middleware)



2.Validating slot id which looks like "slotId":"uuid_2026-02-06_09:00"

i know how do i validaye date and time but not uuid its very long so for that we can use .+ which means it matches anything

the whole is  - regex(\^.+_/d{4}-/d{2}-/d{2}_/d{2}:/d{2}$\)

3.You need to use .map() evrytime you want to return an array 

if the expected output is
 {
  "date": "2026-02-06",
  "services": [
    {
      "serviceId": "uuid",
      "serviceName": "Physiotherapy",
      "appointments": [
        {
          "appointmentId": "uuid",
          "userName": "Rahul",
          "startTime": "09:00",
          "endTime": "09:30",
          "status": "BOOKED"
        }
      ]
    }
  ]
}

then mapping would look like - 
const allAppointments = {
            date: date,
            services: services.map((ser) => ({
                serviceId: ser.id,
                serviceName: ser.name,
                appointments: service.appointment.map((app) => ({
                    appointmentId: app.id,
                    userName: app.user.name,
                    startTime: app.startTime,
                    endTime: app.endTime,
                    status: app.status
                }))

            }))}

       




and to achieve this you need to learn nesting includes (include inside include) to call db

4. like this -
  const services = await prisma.service.findMany({
        where: {
            provider: providerId
        }, include: {
            appointment:{
                include:{
                    user:true
                }
            }    
        }
    })



5.sorting by any property in prisma 

const services = await prisma.service.findMany({
            where: {
                provider: providerId
            }, include: {
                appointment: {
                    orderBy: {
                        startTime : "asc"  //this will sort it in ascending order 
                    }
                    ,include: {
                        user: true
                    }
                }
            }
        })
