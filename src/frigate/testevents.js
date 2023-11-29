

const frigateTestEvents = {
    new: {
        "before": {
            "id": "1701219277.370731-gsjiax",
            "camera": "front_door",
            "frame_time": 1701219277.370731,
            "snapshot_time": 0,
            "label": "person",
            "sub_label": null,
            "top_score": 0,
            "false_positive": true,
            "start_time": 1701219277.370731,
            "end_time": null,
            "score": 0.6776189804077148,
            "box": [
                567,
                333,
                703,
                479
            ],
            "area": 19856,
            "ratio": 0.9315068493150684,
            "region": [
                224,
                0,
                704,
                480
            ],
            "stationary": false,
            "motionless_count": 0,
            "position_changes": 0,
            "current_zones": [],
            "entered_zones": [],
            "has_clip": false,
            "has_snapshot": false
        },
        "after": {
            "id": "1701219277.370731-gsjiax",
            "camera": "front_door",
            "frame_time": 1701219281.108612,
            "snapshot_time": 1701219281.108612,
            "label": "person",
            "sub_label": null,
            "top_score": 0.7281224727630615,
            "false_positive": false,
            "start_time": 1701219277.370731,
            "end_time": null,
            "score": 0.7153759002685547,
            "box": [
                252,
                133,
                441,
                477
            ],
            "area": 65016,
            "ratio": 0.5494186046511628,
            "region": [
                0,
                0,
                708,
                708
            ],
            "stationary": false,
            "motionless_count": 2,
            "position_changes": 1,
            "current_zones": [
                "porch"
            ],
            "entered_zones": [
                "porch"
            ],
            "has_clip": true,
            "has_snapshot": true
        },
        "type": "new"
    },
    update: {
        "before": {
            "id": "1701219277.370731-gsjiax",
            "camera": "front_door",
            "frame_time": 1701219281.108612,
            "snapshot_time": 1701219281.108612,
            "label": "person",
            "sub_label": null,
            "top_score": 0.7281224727630615,
            "false_positive": false,
            "start_time": 1701219277.370731,
            "end_time": null,
            "score": 0.7153759002685547,
            "box": [
                252,
                133,
                441,
                477
            ],
            "area": 65016,
            "ratio": 0.5494186046511628,
            "region": [
                0,
                0,
                708,
                708
            ],
            "stationary": false,
            "motionless_count": 2,
            "position_changes": 1,
            "current_zones": [
                "porch"
            ],
            "entered_zones": [
                "porch"
            ],
            "has_clip": true,
            "has_snapshot": true
        },
        "after": {
            "id": "1701219277.370731-gsjiax",
            "camera": "front_door",
            "frame_time": 1701219285.728416,
            "snapshot_time": 1701219282.718541,
            "label": "person",
            "sub_label": null,
            "top_score": 0.8638695478439331,
            "false_positive": false,
            "start_time": 1701219277.370731,
            "end_time": null,
            "score": 0.74560546875,
            "box": [
                221,
                42,
                275,
                199
            ],
            "area": 8478,
            "ratio": 0.34394904458598724,
            "region": [
                0,
                0,
                416,
                416
            ],
            "stationary": false,
            "motionless_count": 0,
            "position_changes": 1,
            "current_zones": [
                "porch"
            ],
            "entered_zones": [
                "porch"
            ],
            "has_clip": true,
            "has_snapshot": true
        },
        "type": "update"
    },
    end: {
        "before": {
            "id": "1701219277.370731-gsjiax",
            "camera": "front_door",
            "frame_time": 1701219300.158027,
            "snapshot_time": 1701219282.718541,
            "label": "person",
            "sub_label": null,
            "top_score": 0.8638695478439331,
            "false_positive": false,
            "start_time": 1701219277.370731,
            "end_time": null,
            "score": 0.57275390625,
            "box": [
                249,
                31,
                290,
                156
            ],
            "area": 5125,
            "ratio": 0.328,
            "region": [
                63,
                0,
                479,
                416
            ],
            "stationary": true,
            "motionless_count": 51,
            "position_changes": 1,
            "current_zones": [
                "porch"
            ],
            "entered_zones": [
                "porch"
            ],
            "has_clip": true,
            "has_snapshot": true
        },
        "after": {
            "id": "1701219277.370731-gsjiax",
            "camera": "front_door",
            "frame_time": 1701219305.377933,
            "snapshot_time": 1701219282.718541,
            "label": "person",
            "sub_label": null,
            "top_score": 0.8638695478439331,
            "false_positive": false,
            "start_time": 1701219277.370731,
            "end_time": 1701219310.532894,
            "score": 0.57275390625,
            "box": [
                249,
                31,
                290,
                156
            ],
            "area": 5125,
            "ratio": 0.328,
            "region": [
                63,
                0,
                479,
                416
            ],
            "stationary": true,
            "motionless_count": 77,
            "position_changes": 1,
            "current_zones": [
                "porch"
            ],
            "entered_zones": [
                "driveway",
                "porch"
            ],
            "has_clip": true,
            "has_snapshot": true
        },
        "type": "end"
    }
}

exports.frigateTestEvents = frigateTestEvents
