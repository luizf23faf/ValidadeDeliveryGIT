  /* ---------- Util: notifications ---------- */
        function showNotification(message, type = 'info', duration = 3600) {
            const container = document.getElementById('notification-container');
            const el = document.createElement('div');
            el.className = `notification ${type}`;
            el.textContent = message;
            container.appendChild(el);
            // allow animation
            requestAnimationFrame(() => el.classList.add('show'));
            setTimeout(() => {
                el.classList.remove('show');
                setTimeout(() => container.removeChild(el), 320);
            }, duration);
        }

        /* ---------- Toggle password visibility ---------- */
        const eyeBtn = document.getElementById('eyeBtn');
        function togglePasswordVisibility() {
            const input = document.getElementById('password');
            if (input.type === 'password') {
                input.type = 'text';
                eyeBtn.textContent = '🙈';
                eyeBtn.setAttribute('aria-label', 'Ocultar senha');
            } else {
                input.type = 'password';
                eyeBtn.textContent = '👁';
                eyeBtn.setAttribute('aria-label', 'Mostrar senha');
            }
        }
        eyeBtn.addEventListener('click', togglePasswordVisibility);
        eyeBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePasswordVisibility(); }
        });

        /* ---------- Providers (simulação) ---------- */
        function loginWithProvider(event, provider) {
            const btn = event.currentTarget;
            const original = btn.innerHTML;
            btn.classList.add('loading');
            btn.disabled = true;
            btn.textContent = 'Conectando...';
            setTimeout(() => {
                // simula sucesso
                const ok = true;
                if (ok) {
                    showNotification(`Login com ${provider} realizado!`, 'success', 1800);
                    setTimeout(() => location.href = 'teladepedidos.html', 1100); // redirect
                } else {
                    showNotification(`Falha ao conectar com ${provider}`, 'error');
                    btn.classList.remove('loading');
                    btn.disabled = false;
                    btn.innerHTML = original;
                }
            }, 1400);
        }

        /* ---------- Registrar (placeholder) ---------- */
        function showRegister() {
            showNotification('Redirecionando para registro...', 'info', 1400);
            setTimeout(() => location.href = 'register.html', 900);
        }

        /* ---------- Esqueci senha (placeholder) ---------- */
        function forgotPassword(e) {
            e.preventDefault();
            showNotification('Link de recuperação enviado (simulado).', 'info', 2200);
        }

        /* ---------- Validações ---------- */
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validatePasswordStrength(pwd) {
            const minLength = pwd.length >= 6;
            const hasNumber = /\d/.test(pwd);
            const hasLetter = /[a-zA-Z]/.test(pwd);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
            let score = 0;
            if (minLength) score++;
            if (hasNumber) score++;
            if (hasLetter) score++;
            if (hasSpecial) score++;
            // score 0..4
            return {
                score,
                isValid: score >= 3, // considerar válido quando >=3 (ex: letra + número + tamanho)
                label: score <= 1 ? 'Fraca' : score === 2 ? 'Média' : 'Forte'
            };
        }

        /* ---------- Força visual ---------- */
        const pwdInput = document.getElementById('password');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        pwdInput.addEventListener('input', function () {
            const val = this.value;
            const result = validatePasswordStrength(val);
            // preencher largura: score * 25%
            strengthBar.style.width = (result.score * 25) + '%';
            strengthText.style.display = val.length ? 'block' : 'none';
            strengthText.textContent = val.length ? `Força: ${result.label}` : '';
            // color via gradient position: we'll set background-size trick
            // quick color change
            if (result.score <= 1) { strengthBar.style.background = 'linear-gradient(90deg,#f44336,#ff7043)'; }
            else if (result.score === 2) { strengthBar.style.background = 'linear-gradient(90deg,#ff9800,#ffb74d)'; }
            else { strengthBar.style.background = 'linear-gradient(90deg,#66bb6a,#4caf50)'; }
            // error highlight if too short
            if (val.length > 0 && val.length < 6) this.parentNode.classList.add('error');
            else this.parentNode.classList.remove('error');
        });

        /* ---------- Form submit (fake auth) ---------- */
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            const emailGroup = document.getElementById('email-group');
            const passwordGroup = document.getElementById('password-group');
            const submitBtn = document.querySelector('.login-btn');

            // limpar erros visuais
            emailGroup.classList.remove('error');
            passwordGroup.classList.remove('error');

            let hasError = false;
            if (!email || !isValidEmail(email)) { emailGroup.classList.add('error'); hasError = true; }
            const pwdCheck = validatePasswordStrength(password);
            if (!password || !pwdCheck.isValid) { passwordGroup.classList.add('error'); hasError = true; }

            if (hasError) {
                showNotification('Corrija os erros no formulário.', 'error', 2400);
                return;
            }

            // simular loading e autenticação fake
            const original = submitBtn.innerHTML;
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Entrando...';

            setTimeout(() => {
                // credenciais de teste:
                // email: teste123@gmail.com
                // senha: 13030527aa
                if (email.toLowerCase() === 'teste123@gmail.com' && password === '13030527aa') {
                    // salvar email se lembrar
                    if (remember) { localStorage.setItem('rememberUserEmail', email); localStorage.setItem('rememberUser', 'true'); }
                    else { localStorage.removeItem('rememberUserEmail'); localStorage.removeItem('rememberUser'); }
                    showNotification('Login efetuado com sucesso!', 'success', 1600);
                    setTimeout(() => location.href = 'teladepedidos.html', 1100);
                } else {
                    showNotification('Email ou senha incorretos (use teste123@gmail.com / 13030527aa).', 'error', 3000);
                    submitBtn.classList.remove('loading'); submitBtn.disabled = false; submitBtn.innerHTML = original;
                }
            }, 1200);
        });

        /* ---------- Remove erro quando digitar novamente ---------- */
        document.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', () => inp.parentNode.classList.remove('error'));
        });

        /* ---------- Carregar dados salvos (remember me) ---------- */
        document.addEventListener('DOMContentLoaded', () => {
            const saved = localStorage.getItem('rememberUserEmail');
            if (saved) {
                document.getElementById('email').value = saved;
                document.getElementById('remember').checked = true;
                showNotification('Bem-vindo de volta!', 'info', 1600);
            }
        });