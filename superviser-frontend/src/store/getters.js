export default {
  isLoggedIn(state) {
    return !(Object.entries(state.user).length === 0
      && state.user.constructor === Object);
  },
  processes(state) {
    return Object.values(state.processes);
  },
  processesStatus(state) {
    const values = Object.values(state.processes).map((process) => {
      if (process.status === 'draft')  return 'draft';
      const today = new Date();
      if (today <= new Date(process.deadline)) return 'open';
      return 'closed';
    });
    const statuses = {};
    for (let k=0; k<values.length; k++) {
      statuses[Object.values(state.processes)[k]._id] = values[k];
    }
    return statuses;
  },
  openedProcesses(state) {
    const today = new Date();
    return Object.values(state.processes).filter((process) => {
      return process.status === 'open' && new Date(process.deadline) >= today;
    });
  },
  closedProcesses(state) {
    const today = new Date();
    return Object.values(state.processes).filter((process) => {
      return process.status === 'closed' || (process.status === 'open' && new Date(process.deadline) < today);
    });
  },
  draftProcesses(state) {
    return Object.values(state.processes).filter((process) => {
      return process.status === 'draft';
    });
  },
  lasts10Applicants(state) {
    const allApplicants = Object.values(state.applicantsByProcessId).reduce((prev, curr) => {
      return prev.concat(Object.values(curr));
    }, []);
    allApplicants.sort((appA, appB) => {
      const deadlineA = new Date(appA.createdAt);
      const deadlineB = new Date(appB.createdAt);
      if (deadlineA == deadlineB) return 0;
      if (deadlineA < deadlineB) return 1;
      return -1;
    })
    return allApplicants.splice(0, 10);
  },
  pendingApplicants(state) {
    const allApplicants = Object.values(state.applicantsByProcessId).reduce((prev, curr) => {
      return prev.concat(Object.values(curr));
    }, []);

    const pendingApplicants = allApplicants.filter((applicant) => {
      if (applicant.status !== 'pending') return false;
      const steps = applicant.process.steps;
      let waitingValidation = true;
      for (let stepIndex=0; stepIndex<steps.length; stepIndex++) {
        const step = steps[stepIndex];
        if (step.status === 'todo')
          waitingValidation = false;
        if (step.status === 'pending')
          return true;
      }
      return waitingValidation;
    });
    return pendingApplicants;
  }
}
