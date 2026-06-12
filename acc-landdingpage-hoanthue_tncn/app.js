document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.fade-in, .fade-in-up');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    revealElements.forEach((element, index) => {
        const previous = revealElements[index - 1];
        const isSameGroup = previous && previous.parentElement === element.parentElement;
        const groupIndex = isSameGroup ? (parseInt(previous.dataset.revealIndex, 10) || 0) + 1 : 0;

        element.dataset.revealIndex = groupIndex;
        element.style.setProperty('--reveal-index', Math.min(groupIndex, 6));
    });
    
    if (prefersReducedMotion) {
        revealElements.forEach(element => {
            element.classList.add('visible');
        });
    } else if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.requestAnimationFrame(() => {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    });
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -80px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    /* ==========================================================================
       FAQ ACCORDION TRIGGERS
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================================================
       TAX CALCULATOR WIDGET LOGIC
       ========================================================================== */
    const incomeInput = document.getElementById('calc-income');
    const dependentsInput = document.getElementById('calc-dependents');
    const taxPaidInput = document.getElementById('calc-tax-paid');
    const btnCalculate = document.getElementById('btn-calculate');
    const depMinus = document.getElementById('dep-minus');
    const depPlus = document.getElementById('dep-plus');
    
    const calcPlaceholder = document.getElementById('calc-result-placeholder');
    const calcDisplay = document.getElementById('calc-result-display');
    
    // Result fields
    const resRefund = document.getElementById('result-refund-amount');
    const resDeductions = document.getElementById('result-total-deductions');
    const resTaxable = document.getElementById('result-taxable-income');
    const resTaxPayable = document.getElementById('result-tax-payable');
    const resOverpaid = document.getElementById('result-overpaid');
    const resAdviceBox = document.getElementById('result-advice-box');
    const calcCtaBtn = document.getElementById('calc-cta-btn');

    // Dependents Counter handlers
    if (depMinus && depPlus && dependentsInput) {
        depMinus.addEventListener('click', () => {
            let val = parseInt(dependentsInput.value) || 0;
            if (val > 0) {
                dependentsInput.value = val - 1;
            }
        });
        
        depPlus.addEventListener('click', () => {
            let val = parseInt(dependentsInput.value) || 0;
            if (val < 20) {
                dependentsInput.value = val + 1;
            }
        });
    }

    // Number Formatting on input (Format as 1,000,000 as the user types)
    const numberFormatInputs = document.querySelectorAll('.number-format-input');
    numberFormatInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                e.target.value = parseInt(value, 10).toLocaleString('en-US');
            } else {
                e.target.value = '';
            }
        });
    });

    // Parse formatted string back to raw number
    function parseFormattedNumber(str) {
        if (!str) return 0;
        return parseFloat(str.replace(/,/g, '')) || 0;
    }

    // Format number to currency display
    function formatVND(num) {
        return num.toLocaleString('vi-VN') + ' đ';
    }

    // Tax calculation handler
    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            const annualIncome = parseFormattedNumber(incomeInput.value);
            const dependents = parseInt(dependentsInput.value) || 0;
            const taxPaid = parseFormattedNumber(taxPaidInput.value);

            if (annualIncome <= 0) {
                alert('Vui lòng nhập tổng thu nhập chịu thuế lớn hơn 0.');
                incomeInput.focus();
                return;
            }

            // Calculation based on 2026 rules (Nghị quyết 110/2025/UBTVQH15)
            // Monthly base deductions:
            // Self: 15,500,000 VND
            // Dependent: 6,200,000 VND
            const MONTHLY_SELF_DEDUCTION = 15500000;
            const MONTHLY_DEP_DEDUCTION = 6200000;
            
            const annualSelfDeduction = MONTHLY_SELF_DEDUCTION * 12;
            const annualDepDeduction = MONTHLY_DEP_DEDUCTION * 12 * dependents;
            const totalDeductions = annualSelfDeduction + annualDepDeduction;
            
            const taxableIncome = Math.max(0, annualIncome - totalDeductions);
            const monthlyTaxableIncome = taxableIncome / 12;
            
            let monthlyTax = 0;
            
            if (monthlyTaxableIncome > 0) {
                // Vietnam Progressive Tax Brackets (Monthly Basis)
                const brackets = [
                    { limit: 5000000, rate: 0.05 },       // Level 1: Up to 5M (5%)
                    { limit: 10000000, rate: 0.10 },      // Level 2: 5M to 10M (10%)
                    { limit: 18000000, rate: 0.15 },      // Level 3: 10M to 18M (15%)
                    { limit: 32000000, rate: 0.20 },      // Level 4: 18M to 32M (20%)
                    { limit: 52000000, rate: 0.25 },      // Level 5: 32M to 52M (25%)
                    { limit: 80000000, rate: 0.30 },      // Level 6: 52M to 80M (30%)
                    { limit: Infinity, rate: 0.35 }       // Level 7: Above 80M (35%)
                ];
                
                let remaining = monthlyTaxableIncome;
                let previousLimit = 0;
                
                for (let i = 0; i < brackets.length; i++) {
                    let currentLimit = brackets[i].limit;
                    let currentRate = brackets[i].rate;
                    let range = currentLimit - previousLimit;
                    
                    if (remaining > range) {
                        monthlyTax += range * currentRate;
                        remaining -= range;
                        previousLimit = currentLimit;
                    } else {
                        monthlyTax += remaining * currentRate;
                        break;
                    }
                }
            }
            
            const annualTaxPayable = Math.round(monthlyTax * 12);
            const refundAmount = Math.max(0, taxPaid - annualTaxPayable);
            
            // Render results
            resDeductions.textContent = formatVND(totalDeductions);
            resTaxable.textContent = formatVND(taxableIncome);
            resTaxPayable.textContent = formatVND(annualTaxPayable);
            resOverpaid.textContent = formatVND(Math.max(0, taxPaid - annualTaxPayable));
            
            if (refundAmount > 0) {
                resRefund.textContent = formatVND(refundAmount);
                resRefund.style.color = '#7a2828';
                
                resAdviceBox.className = 'result-advice alert-box success';
                resAdviceBox.innerHTML = `
                    <strong>Chúc mừng!</strong> Bạn dự kiến được hoàn lại <strong>${formatVND(refundAmount)}</strong> số thuế đã nộp dư. Hãy để ACC hỗ trợ làm hồ sơ trọn gói giúp bạn nhận lại tiền nhanh nhất.
                `;
                calcCtaBtn.textContent = 'Yêu Cầu Làm Hồ Sơ Ngay';
                calcCtaBtn.href = `#contact?refund=${refundAmount}`;
            } else {
                resRefund.textContent = '0 đ';
                resRefund.style.color = '#707070';
                
                resAdviceBox.className = 'result-advice alert-box warning';
                resAdviceBox.innerHTML = `
                    <strong>Thông báo:</strong> Không phát sinh số thuế được hoàn. Theo dữ liệu tính toán, số thuế bạn đã tạm nộp thấp hơn hoặc bằng số thuế phải nộp thực tế. Vui lòng liên hệ ACC nếu cần rà soát kỹ hơn.
                `;
                calcCtaBtn.textContent = 'Liên Hệ ACC Để Kiểm Tra Rà Soát';
                calcCtaBtn.href = '#contact';
            }
            
            // Switch tabs
            calcPlaceholder.classList.add('d-none');
            calcDisplay.classList.remove('d-none');
        });
    }

    // Feed calculator refund to Contact Form message
    if (calcCtaBtn) {
        calcCtaBtn.addEventListener('click', (e) => {
            const href = calcCtaBtn.getAttribute('href');
            if (href.startsWith('#contact')) {
                const messageTextarea = document.getElementById('contact-message');
                const incomeVal = incomeInput.value;
                const depVal = dependentsInput.value;
                const taxPaidVal = taxPaidInput.value;
                
                if (messageTextarea) {
                    if (href.includes('refund=')) {
                        const match = href.match(/refund=(\d+)/);
                        const refundVal = match ? parseInt(match[1]) : 0;
                        messageTextarea.value = `Xin chào ACC, tôi đã tính thử thuế bằng công cụ trên website:\n- Thu nhập: ${incomeVal} đ\n- Người phụ thuộc: ${depVal}\n- Số thuế đã tạm nộp: ${taxPaidVal} đ\n- Dự kiến hoàn: ${formatVND(refundVal)}\nTôi muốn nhờ ACC tư vấn làm hồ sơ hoàn số tiền này.`;
                    } else {
                        messageTextarea.value = `Xin chào ACC, tôi đã tính thử thuế bằng công cụ trên website:\n- Thu nhập: ${incomeVal} đ\n- Người phụ thuộc: ${depVal}\n- Số thuế đã tạm nộp: ${taxPaidVal} đ\nTôi muốn nhờ ACC rà soát kỹ hơn xem có được hoàn thuế hay không.`;
                    }
                }
            }
        });
    }

    /* ==========================================================================
       FORM INTERACTIVE ACTION & SUCCESS STATES (Toast Notification)
       ========================================================================== */
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    const heroForm = document.getElementById('hero-quick-form');
    const contactForm = document.getElementById('main-contact-form');

    function showToast(message, isSuccess = true) {
        toastMsg.textContent = message;
        if (isSuccess) {
            toast.style.backgroundColor = '#2e7d32'; // Green
        } else {
            toast.style.backgroundColor = '#d32f2f'; // Red
        }
        
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);
    }

    function handleFormSubmit(form, successMsg) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.btn-submit');
            const submitSpan = submitBtn.querySelector('span');
            const originalText = submitSpan.textContent;
            
            // Visual loading state
            submitBtn.disabled = true;
            submitSpan.textContent = 'Đang gửi thông tin...';
            submitBtn.style.opacity = '0.7';
            
            // Simulate API request delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitSpan.textContent = originalText;
                submitBtn.style.opacity = '1';
                
                // Show success feedback
                showToast(successMsg, true);
                form.reset();
            }, 1200);
        });
    }

    if (heroForm) {
        handleFormSubmit(heroForm, 'Gửi yêu cầu thành công! Chuyên viên ACC sẽ liên hệ kiểm tra điều kiện hoàn thuế miễn phí cho bạn trong 15 phút.');
    }
    
    if (contactForm) {
        handleFormSubmit(contactForm, 'Đăng ký tư vấn hoàn thuế thành công! Luật sư và chuyên viên thuế ACC sẽ sớm liên hệ rà soát hồ sơ của bạn.');
    }
});
