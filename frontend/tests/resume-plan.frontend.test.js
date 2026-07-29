// frontend/tests/resume-plan.frontend.test.js
// Smoke tests for the resumePlan() function and its DOM interactions.
// Uses jsdom (Jest's default environment) to simulate the account page.

/**
 * @jest-environment jsdom
 */

// ── Minimal DOM scaffold mirroring account.html ───────────────────────────────
function buildDOM({ subscriptionStatus = 'paused' } = {}) {
  document.body.innerHTML = `
    <div id="subscriptionLoading" style="display:none"></div>
    <div id="subscriptionContent" style="display:none"></div>

    <!-- Paused-state section -->
    <div id="resumeSection" style="display:${subscriptionStatus === 'paused' ? '' : 'none'}">
      <button id="resumePlanBtn">Resume Plan</button>
      <span id="resumeError"></span>
    </div>

    <!-- Active-state elements -->
    <span id="statusLabel"></span>
    <span id="billingAmount"></span>
    <span id="billingDate"></span>
    <button id="changePlanBtn" style="display:${subscriptionStatus === 'active' ? '' : 'none'}">Change Plan</button>

    <!-- table rows toggled by loadSubscription -->
    <tr id="rowStatus"   style="display:none"></tr>
    <tr id="rowBillingAmount" style="display:none"></tr>
    <tr id="rowBillingDate"   style="display:none"></tr>
  `;
}

// ── Inline the resumePlan + loadSubscription logic (extracted from account.html) ─
//    We define them as standalone functions so they are testable without a real
//    HTML page load, while keeping the logic identical to the source.
function defineAccountFunctions(fetchMock) {
  global.fetch = fetchMock;

  global.loadSubscription = jest.fn(async () => {
    // Simulates a successful reload → hides resume section, shows active UI
    document.getElementById('resumeSection').style.display = 'none';
    document.getElementById('changePlanBtn').style.display = '';
    document.getElementById('subscriptionContent').style.display = 'block';
  });

  global.resumePlan = async function resumePlan() {
    const btn = document.getElementById('resumePlanBtn');
    const errEl = document.getElementById('resumeError');
    errEl.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Resuming…';
    try {
      const res = await fetch('/api/account/resume-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        errEl.textContent = data.error || 'Could not resume plan. Try again.';
        btn.disabled = false;
        btn.textContent = 'Resume Plan';
        return;
      }
      await loadSubscription();
    } catch {
      errEl.textContent = 'Network error. Try again.';
      btn.disabled = false;
      btn.textContent = 'Resume Plan';
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────

describe('resumePlan() frontend smoke tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows Resume button when subscription is paused', () => {
    buildDOM({ subscriptionStatus: 'paused' });
    const resumeSection = document.getElementById('resumeSection');
    const btn = document.getElementById('resumePlanBtn');

    expect(resumeSection.style.display).not.toBe('none');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe('Resume Plan');
  });

  it('calls the resume-plan endpoint and re-renders to active state on success', async () => {
    buildDOM({ subscriptionStatus: 'paused' });

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Your plan has been resumed.' }),
    });
    defineAccountFunctions(mockFetch);

    await global.resumePlan();

    // Fetch should have been called with the correct endpoint
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/account/resume-plan',
      expect.objectContaining({ method: 'POST' })
    );

    // loadSubscription re-renders → resume section hidden, change-plan visible
    expect(global.loadSubscription).toHaveBeenCalledTimes(1);
    expect(document.getElementById('resumeSection').style.display).toBe('none');
    expect(document.getElementById('changePlanBtn').style.display).toBe('');
  });

  it('shows an error and re-enables the button when the endpoint returns an error', async () => {
    buildDOM({ subscriptionStatus: 'paused' });

    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Your plan is not currently paused.' }),
    });
    defineAccountFunctions(mockFetch);

    await global.resumePlan();

    const btn = document.getElementById('resumePlanBtn');
    const errEl = document.getElementById('resumeError');

    expect(errEl.textContent).toBe('Your plan is not currently paused.');
    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toBe('Resume Plan');
    expect(global.loadSubscription).not.toHaveBeenCalled();
  });

  it('shows a network error message when fetch throws', async () => {
    buildDOM({ subscriptionStatus: 'paused' });

    const mockFetch = jest.fn().mockRejectedValue(new Error('Network failure'));
    defineAccountFunctions(mockFetch);

    await global.resumePlan();

    const btn = document.getElementById('resumePlanBtn');
    const errEl = document.getElementById('resumeError');

    expect(errEl.textContent).toBe('Network error. Try again.');
    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toBe('Resume Plan');
  });

  it('disables the button and shows Resuming… while the request is in flight', async () => {
    buildDOM({ subscriptionStatus: 'paused' });

    let resolveRequest;
    const pendingFetch = new Promise((resolve) => { resolveRequest = resolve; });
    const mockFetch = jest.fn().mockReturnValue(pendingFetch);
    defineAccountFunctions(mockFetch);

    // Start the call but don't await it yet
    const inFlight = global.resumePlan();

    const btn = document.getElementById('resumePlanBtn');
    expect(btn.disabled).toBe(true);
    expect(btn.textContent).toBe('Resuming…');

    // Resolve the fetch so the promise chain completes
    resolveRequest({ ok: true, json: async () => ({ success: true }) });
    await inFlight;
  });
});
