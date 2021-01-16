const reports = []

function processRequest(report) {
    setTimeout(() => {
        report.status = "done"
        report.details = ["obj1, obj2, obj3"]
        report.image = report.sourceImage
    }, 10000)
}

const requestReport = (sourceImage) => {
    const report = {
        id: new Date().getTime(),
        status: "pending",
        sourceImage: sourceImage
    }
    addReport(report)
    processRequest(report)
    return { id: report.id, status: report.status }
}

const addReport = (report) => {
    reports.push(report)
}

const getReport = (id) => {
    return reports.find((report) => report.id == id)
}

module.exports = { getReport, requestReport }