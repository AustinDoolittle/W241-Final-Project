import os

from src.enums import AssignmentStatus

class SoundFileRetriever:
    _MALE_VOICE_DIRNAME = 'male'
    _FEMALE_VOICE_DIRNAME = 'female'
    _ROBOT_VOICE_DIRNAME = 'robot'

    _DIRNAME_LUT = {
        AssignmentStatus.Control: _ROBOT_VOICE_DIRNAME,
        AssignmentStatus.TreatmentFemale: _FEMALE_VOICE_DIRNAME,
        AssignmentStatus.TreatmentMale: _MALE_VOICE_DIRNAME
    }

    def __init__(self, sound_file_base_dir):
        self.sound_file_base_dir = sound_file_base_dir

    def resolve_filename(self, filename, assignment_status):
        if filename == 'select_letter_b.mp3':
            return os.path.join(self.sound_file_base_dir, filename)
        
        subdir_name = self._DIRNAME_LUT[assignment_status]

        return os.path.join(self.sound_file_base_dir, subdir_name, filename)
