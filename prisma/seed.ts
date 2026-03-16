import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    
    console.log("🌱 Seeding database...");

    await prisma.task.deleteMany()
    await prisma.user.deleteMany()

    console.log("✅Cleared existing data from database")

    // Create users
    const adminPassword = await bcrypt.hash("admin123", 10)
    const userPassword = await bcrypt.hash("user123", 10)

    const admin = await prisma.user.create({
        data: {
        email: "admin@example.com",
        name: "Administrador",
        password: adminPassword,
        isAdmin: true,
        },
    })

    const user1 = await prisma.user.create({
        data: {
        email: "joao@example.com",
        name: "Joao Silva",
        password: userPassword,
        isAdmin: false,
        },
    })

    const user2 = await prisma.user.create({
        data: {
        email: "maria@example.com",
        name: "Maria Santos",
        password: userPassword,
        isAdmin: false,
        },
    })

    const user3 = await prisma.user.create({
        data: {
        email: "pedro@example.com",
        name: "Pedro Oliveira",
        password: userPassword,
        isAdmin: false,
        },
    })

    console.log("Created users:", { admin: admin.email, user1: user1.email, user2: user2.email, user3: user3.email })

    // Create tasks
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const tasks = await prisma.task.createMany({
        data: [
        // Admin tasks
        {
            title: "Revisar relatorios mensais",
            description: "Analisar e aprovar os relatorios de desempenho do mes anterior",
            priority: "HIGH",
            status: "IN_PROGRESS",
            deadline: tomorrow,
            userId: admin.id,
        },
        {
            title: "Reuniao de planejamento",
            description: "Organizar reuniao trimestral com a equipe de desenvolvimento",
            priority: "MEDIUM",
            status: "PENDING",
            deadline: nextWeek,
            userId: admin.id,
        },
        // User 1 tasks (Joao)
        {
            title: "Desenvolver nova feature",
            description: "Implementar sistema de notificacoes push para o aplicativo mobile",
            priority: "HIGH",
            status: "IN_PROGRESS",
            deadline: nextWeek,
            userId: user1.id,
        },
        {
            title: "Corrigir bug no login",
            description: "Investigar e corrigir erro de autenticacao reportado pelos usuarios",
            priority: "HIGH",
            status: "DONE",
            deadline: yesterday,
            userId: user1.id,
        },
        {
            title: "Atualizar documentacao",
            description: "Revisar e atualizar a documentacao da API REST",
            priority: "LOW",
            status: "PENDING",
            deadline: nextMonth,
            userId: user1.id,
        },
        // User 2 tasks (Maria)
        {
            title: "Design do dashboard",
            description: "Criar mockups para o novo painel administrativo",
            priority: "MEDIUM",
            status: "IN_PROGRESS",
            deadline: tomorrow,
            userId: user2.id,
        },
        {
            title: "Testes de usabilidade",
            description: "Conduzir testes com usuarios para validar nova interface",
            priority: "MEDIUM",
            status: "PENDING",
            deadline: nextWeek,
            userId: user2.id,
        },
        {
            title: "Apresentacao de resultados",
            description: "Preparar slides com metricas de UX do ultimo trimestre",
            priority: "LOW",
            status: "DONE",
            deadline: yesterday,
            userId: user2.id,
        },
        // User 3 tasks (Pedro)
        {
            title: "Configurar servidor de producao",
            description: "Realizar deploy e configuracao do ambiente de producao na AWS",
            priority: "HIGH",
            status: "PENDING",
            deadline: tomorrow,
            userId: user3.id,
        },
        {
            title: "Backup do banco de dados",
            description: "Configurar rotina automatica de backup diario",
            priority: "HIGH",
            status: "DONE",
            deadline: yesterday,
            userId: user3.id,
        },
        {
            title: "Monitoramento de performance",
            description: "Implementar dashboards de monitoramento com Grafana",
            priority: "MEDIUM",
            status: "IN_PROGRESS",
            deadline: nextWeek,
            userId: user3.id,
        },
        {
            title: "Auditoria de seguranca",
            description: "Revisar configuracoes de seguranca e permissoes de acesso",
            priority: "LOW",
            status: "PENDING",
            deadline: nextMonth,
            userId: user3.id,
        },
        ],
    })

    console.log(`Created ${tasks.count} tasks`)

    console.log("\n✅ Seed successfull🏆")
    console.log("\nTest accounts:")
    console.log("  Admin: admin@example.com / admin123")
    console.log("  User 1: joao@example.com / user123")
    console.log("  User 2: maria@example.com / user123")
    console.log("  User 3: pedro@example.com / user123")
    }

main()
    .then(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
    .catch(async (e) => {
        console.error(e)
        console.log("\n ❌ Seed failed ❌")
        await prisma.$disconnect()
        process.exit(1)
    })
