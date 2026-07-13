from production.workflow import (
    update_job_card_status,
    update_production_request_status,
)


def update_batch_after_inspection(batch):

    """
    Called whenever an Inspection
    is created or updated.
    """

    # Future:
    # batch.status = "INSPECTION_COMPLETE"

    batch.save(update_fields=[])


def update_job_card_after_inspection(job_card):

    update_job_card_status(job_card)


def update_production_request_after_inspection(request):

    update_production_request_status(request)


def update_inspection_workflow(inspection):

    batch = inspection.batch

    job_card = batch.production

    request = job_card.production_request

    update_batch_after_inspection(batch)

    update_job_card_after_inspection(job_card)

    update_production_request_after_inspection(request)