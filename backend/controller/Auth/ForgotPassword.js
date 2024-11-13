// controllers/Auth/ForgotPassword.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'jonathanhdz262@outlook.com',
        pass: 'Jonathanhdz9'
    }
});

const enviarMail = async (direccion, token) => {
    const resetUrl = `http://localhost:3001/reset-password/${token}`;
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'rafaelmonje1331@gmail.com',
            pass: 'sljy ihgq hknf tdyc',
        }
    };
    const mensaje = {
        from: 'rafaelmonje1331@gmail.com',
        to: `${direccion}`,
        subject: 'MediClick validación',
        text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetUrl}`,
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${resetUrl}">Restablecer contraseña</a>`
    };
    const transport = nodemailer.createTransport(config);
    await transport.sendMail(mensaje);
};

class ForgotPasswordController {
    static async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });
            await enviarMail(email, token);
            res.json({ message: 'Correo de recuperación enviado' });
        } catch (error) {
            console.error("Error en forgotPassword:", error.message);
            res.status(500).json({ message: 'Error interno del servidor al enviar el correo de recuperación' });
        }
    }

    static async resetPassword(req, res) {
        const { token } = req.params;
        const { password } = req.body;

        try {
            const decoded = jwt.verify(token, 'secreto');
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.updateUser(user.id, user.username, user.email, user.role_id, hashedPassword);
            res.json({ message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            console.error("Error en resetPassword:", error.message);

            if (error instanceof jwt.TokenExpiredError) {
                res.status(400).json({ message: 'El enlace ha expirado, solicita uno nuevo' });
            } else if (error instanceof jwt.JsonWebTokenError) {
                res.status(400).json({ message: 'Token inválido o malformado' });
            } else {
                res.status(500).json({ message: 'Error interno del servidor al restablecer la contraseña' });
            }
        }
    }
}

module.exports = ForgotPasswordController;
