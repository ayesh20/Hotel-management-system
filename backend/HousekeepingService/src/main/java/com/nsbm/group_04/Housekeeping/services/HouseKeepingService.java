package com.nsbm.group_04.Housekeeping.services;

import com.nsbm.group_04.Housekeeping.entity.HouseKeeping;
import com.nsbm.group_04.Housekeeping.repository.HouseKeepingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseKeepingService {

    private final HouseKeepingRepository repository;

    public HouseKeepingService(HouseKeepingRepository repository) {
        this.repository = repository;
    }

    public HouseKeeping save(HouseKeeping houseKeeping) {
        return repository.save(houseKeeping);
    }

    public List<HouseKeeping> getAll() {
        return repository.findAll();
    }

    public HouseKeeping getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public HouseKeeping update(String id, HouseKeeping updated) {
        HouseKeeping existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setRoomNumber(updated.getRoomNumber());
            existing.setStaffId(updated.getStaffId());
            existing.setCleaningDate(updated.getCleaningDate());
            existing.setStatus(updated.getStatus());
            existing.setRemarks(updated.getRemarks());
            return repository.save(existing);
        }
        return null;
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
